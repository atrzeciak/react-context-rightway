import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { type CompatiblePlugin, configs as tseslint } from "typescript-eslint";

import { fileNameMatchesExport } from "./eslintRules/fileNameMatchesExport.ts";

const localPluginDefinition = {
  meta: { name: "local" },
  rules: { "file-name-matches-export": fileNameMatchesExport },
};
// ESLint's Plugin type rejects typescript-eslint rule types; widen it the way typescript-eslint types its own plugin.
const localPlugin: CompatiblePlugin = localPluginDefinition;

export default defineConfig([
  globalIgnores(["dist"]),
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
  },
  {
    extends: [js.configs.recommended, tseslint.strictTypeChecked, tseslint.stylisticTypeChecked, unicorn.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // React and react-* packages.
            ["^react"],
            // Everything else that is not local.
            ["^"],
            // Local files; side-effect imports such as styles come last.
            ["^@/", String.raw`^\.`, String.raw`^\u0000@/`],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      curly: "error",
      eqeqeq: "error",
      "no-param-reassign": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      // React components use PascalCase file names.
      "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
      "unicorn/name-replacements": ["error", { allowList: { Props: true, props: true, ref: true } }],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslintReact.configs["strict-type-checked"],
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite(),
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/main.tsx"],
    plugins: { local: localPlugin },
    rules: { "local/file-name-matches-export": "error" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: String.raw`^\.`, message: "Import local files through the @/ alias (maps to src/)." }] },
      ],
    },
  },
]);
