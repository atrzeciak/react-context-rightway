# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` starts the Vite dev server.
- `npm run build` type-checks with `tsc -b`, then builds with Vite. The type check also covers `vite.config.ts`, `eslint.config.ts`, `eslintRules/` and `tests/`.
- `npm run lint` runs ESLint and fails on any warning. `npm run lint -- --fix` sorts imports and applies other autofixes.
- `npm run format` and `npm run format:check` run Prettier over the whole repo.
- `npm test` runs Vitest once. `npm run test:watch` watches, and `npx vitest run tests/app/Page.test.tsx -t "toggles"` runs one test.
- `npm run test:coverage` fails below 100% coverage of `src/` and `eslintRules/`.

## Tests

- Tests live in `tests/`, mirroring `src/`, not next to the code: the file-name rule would require `DataForm.test.tsx` to export `DataForm.test`.
- Vitest runs two projects from `vite.config.ts`: `app` in jsdom with `tests/setup.ts`, and `eslintRules` in Node for the local rule's `RuleTester` cases.
- jsdom has no `Element.animate`, so `tests/flashes.ts` mocks it. Every call is one `useRenderFlash` flash, and `flashedElements()` lists the elements that rendered since `clearFlashes()`. Render counts are asserted this way.
- `tests/app/renderIsolation.test.tsx` checks the three render guarantees below. It must keep passing.

## Purpose

This is a demo of using React Context as a store without unnecessary re-renders. Every design choice serves that, so check the render behaviour after any change to components or the store. `tests/app/renderIsolation.test.tsx` covers it:

- A click on "Click me" re-renders only `Counter`.
- Typing re-renders only `DataForm` and `DataView`.
- A theme toggle re-renders every flashing component.

Components show their renders on screen with `useRenderFlash` (in `src/theme/`), which outlines the element after each render. StrictMode is deliberately off in `src/main.tsx` so each render flashes once.

## Architecture

- **One store, published in slices.** `src/store/StoreContextProvider.tsx` holds one Immer-updated state object, but exposes it through separate contexts: `useStoreData()`, `useStoreTheme()` and `useStoreActions()`. A component re-renders only when the slice it reads changes. The actions are created once and never change. Keep this shape when adding state: add a slice context rather than widening an existing one.
- **The theme** lives in the store. The provider mirrors it onto `<html data-theme>`, and `src/index.css` themes the whole page from that attribute. `useRenderFlash` reads the theme to pick its outline colour, which is why every flashing component re-renders on a theme toggle.
- **Memoization is part of the demo.** `DataPage`, `DataForm`, `ToggleThemeButton` and `Counter` are wrapped in `memo` so the counter state in `Page` doesn't reach them. A memoized component is a named function declaration exported under its file name, for example `export { MemoizedDataForm as DataForm }`.
- **Layout.** `App` mounts the provider around `Page`. `Page` holds the counter state and lays out the header, the main area and the footer. `DataPage` in `src/pages/` is the content.

## Conventions enforced by ESLint

The ESLint config (`eslint.config.ts`, loaded through `jiti`) is intentionally as strict as possible. It combines typescript-eslint's strict and stylistic type-checked presets, @eslint-react's strict preset, react-hooks, react-refresh and unicorn. Never relax or disable rules. Fix the code instead, or make the config stricter.

- **Imports** of local files use the `@/` alias for `src/`. Relative imports are rejected under `src/`. Imports are sorted into three groups: React, other packages, then local files.
- **File names:** every module in `src/` except `main.tsx` must export a binding named exactly like its file. The local rule in `eslintRules/fileNameMatchesExport.ts` enforces this.
- **Raw HTML elements** are only used inside `src/ui/`. Elsewhere, use the wrappers there, such as `Button`, `Heading`, `Main` and `Box`, or add a new one.
- **Identifiers:** `Props` and `ref` are the only abbreviations allowed.

## Toolchain notes

- Test files get @vitest/eslint-plugin's recommended preset plus stricter rules, eslint-plugin-testing-library's React preset and every eslint-plugin-jest-dom rule. Only `*.test.*` files get them; `tests/setup.ts` and `tests/flashes.ts` are plain modules.

- TypeScript is pinned to `~6.0` because typescript-eslint does not support TypeScript 7 yet.
- Vite resolves the `@/` alias from the tsconfig paths through `resolve.tsconfigPaths`. There is no separate alias config.
