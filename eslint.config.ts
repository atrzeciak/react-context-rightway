import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import jestDom from "eslint-plugin-jest-dom";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import testingLibrary from "eslint-plugin-testing-library";
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
  globalIgnores(["dist", "coverage"]),
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
  {
    files: ["tests/**/*.test.{ts,tsx}"],
    extends: [vitest.configs.recommended],
    rules: {
      "vitest/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],
      "vitest/consistent-vitest-vi": "error",
      "vitest/hoisted-apis-on-top": "error",
      "vitest/max-nested-describe": ["error", { max: 2 }],
      "vitest/no-alias-methods": "error",
      "vitest/no-conditional-in-test": "error",
      "vitest/no-conditional-tests": "error",
      "vitest/no-duplicate-hooks": "error",
      "vitest/no-test-prefixes": "error",
      "vitest/no-test-return-statement": "error",
      "vitest/prefer-called-once": "error",
      "vitest/prefer-comparison-matcher": "error",
      "vitest/prefer-each": "error",
      "vitest/prefer-equality-matcher": "error",
      "vitest/prefer-expect-resolves": "error",
      "vitest/prefer-hooks-in-order": "error",
      "vitest/prefer-hooks-on-top": "error",
      "vitest/prefer-importing-vitest-globals": "error",
      "vitest/prefer-mock-promise-shorthand": "error",
      "vitest/prefer-spy-on": "error",
      "vitest/prefer-strict-boolean-matchers": "error",
      "vitest/prefer-strict-equal": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-be-object": "error",
      "vitest/prefer-to-contain": "error",
      "vitest/prefer-to-have-length": "error",
      "vitest/prefer-todo": "error",
      "vitest/prefer-vi-mocked": "error",
      "vitest/require-mock-type-parameters": "error",
      "vitest/require-to-throw-message": "error",
      "vitest/require-top-level-describe": "error",
      // Replaces the typescript-eslint version, which rejects passing a mocked method to expect().
      "@typescript-eslint/unbound-method": "off",
      "vitest/unbound-method": "error",
    },
  },
  {
    files: ["tests/**/*.test.{ts,tsx}"],
    extends: [testingLibrary.configs["flat/react"], jestDom.configs["flat/all"]],
    // Only RTL's own render counts as a render, so hooks such as useRenderFlash are not mistaken for one.
    settings: { "testing-library/custom-renders": "off" },
    rules: {
      "testing-library/no-debugging-utils": "error",
      "testing-library/prefer-explicit-assert": "error",
      "testing-library/prefer-user-event": "error",
    },
  },
]);
