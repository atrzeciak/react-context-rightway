import { AST_NODE_TYPES, ESLintUtils, type TSESLint, type TSESTree } from "@typescript-eslint/utils";
import path from "node:path";

type ExportedDeclaration = TSESTree.NamedExportDeclarations | TSESTree.DefaultExportDeclarations;

const declaredNames = (declaration: ExportedDeclaration): string[] => {
  if (declaration.type === AST_NODE_TYPES.VariableDeclaration) {
    return declaration.declarations.flatMap(({ id }) => (id.type === AST_NODE_TYPES.Identifier ? [id.name] : []));
  }
  if (declaration.type === AST_NODE_TYPES.Identifier) {
    return [declaration.name];
  }
  return "id" in declaration && declaration.id?.type === AST_NODE_TYPES.Identifier ? [declaration.id.name] : [];
};

export const fileNameMatchesExport = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: { description: "Require each module to export a binding named exactly like its file." },
    messages: { missing: 'Export a binding named "{{name}}" to match the file name.' },
    schema: [],
  },
  defaultOptions: [],
  create(context): TSESLint.RuleListener {
    const expected = path.basename(context.filename, path.extname(context.filename));
    const exported = new Set<string>();

    return {
      ExportNamedDeclaration(node): void {
        if (node.declaration) {
          for (const name of declaredNames(node.declaration)) {
            exported.add(name);
          }
        }
        for (const specifier of node.specifiers) {
          exported.add(specifier.exported.type === AST_NODE_TYPES.Identifier ? specifier.exported.name : specifier.exported.value);
        }
      },
      ExportDefaultDeclaration(node): void {
        for (const name of declaredNames(node.declaration)) {
          exported.add(name);
        }
      },
      "Program:exit"(program): void {
        if (!exported.has(expected)) {
          context.report({ node: program, messageId: "missing", data: { name: expected } });
        }
      },
    };
  },
});
