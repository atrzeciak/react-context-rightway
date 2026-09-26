import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import { fileNameMatchesExport } from "../../eslintRules/fileNameMatchesExport.ts";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
});

const missing = [{ messageId: "missing", data: { name: "Name" } }] as const;

ruleTester.run("file-name-matches-export", fileNameMatchesExport, {
  valid: [
    { name: "exported const", filename: "src/Name.ts", code: "export const Name = 1;" },
    { name: "one of several declarators", filename: "src/Name.ts", code: "export const other = 1, Name = 2;" },
    { name: "exported function", filename: "src/Name.ts", code: "export function Name() {}" },
    { name: "exported class", filename: "src/Name.ts", code: "export class Name {}" },
    { name: "exported type alias", filename: "src/Name.ts", code: "export type Name = string;" },
    { name: "exported interface", filename: "src/Name.ts", code: "export interface Name {}" },
    { name: "exported enum", filename: "src/Name.ts", code: "export enum Name { A }" },
    { name: "renamed export", filename: "src/Name.ts", code: "const Memoized = 1; export { Memoized as Name };" },
    { name: "string-literal export name", filename: "src/Name.ts", code: 'const value = 1; export { value as "Name" };' },
    { name: "re-export", filename: "src/Name.ts", code: 'export { Name } from "./other";' },
    { name: "named default function", filename: "src/Name.ts", code: "export default function Name() {}" },
    { name: "named default class", filename: "src/Name.ts", code: "export default class Name {}" },
    { name: "default export of an identifier", filename: "src/Name.ts", code: "const Name = 1; export default Name;" },
    { name: "tsx component", filename: "src/ui/Name.tsx", code: "export const Name = () => <div />;" },
    { name: "extra exports alongside", filename: "src/Name.ts", code: "export const Name = 1; export const helper = 2;" },
  ],
  invalid: [
    { name: "different name", filename: "src/Name.ts", code: "export const Other = 1;", errors: missing },
    { name: "different case", filename: "src/Name.ts", code: "export const name = 1;", errors: missing },
    { name: "declared but not exported", filename: "src/Name.ts", code: "const Name = 1;", errors: missing },
    { name: "empty module", filename: "src/Name.ts", code: "", errors: missing },
    { name: "anonymous default function", filename: "src/Name.ts", code: "export default function () {}", errors: missing },
    { name: "default export of a literal", filename: "src/Name.ts", code: "export default 42;", errors: missing },
    {
      name: "destructured export",
      filename: "src/Name.ts",
      code: "const source = { Name: 1 }; export const { Name } = source;",
      errors: missing,
    },
    { name: "star re-export", filename: "src/Name.ts", code: 'export * from "./Name";', errors: missing },
    {
      name: "exported under another name",
      filename: "src/Name.ts",
      code: "const Name = 1; export { Name as Other };",
      errors: missing,
    },
  ],
});
