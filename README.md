# React Context - The Right Way

This project demonstrates how to use React's Context API as an application store without unnecessary re-renders. It's a small application built with React, TypeScript, and Vite. Every component outlines itself when it renders, so you can see exactly what each action re-renders.

**Live demo:** <https://atrzeciak.github.io/react-context-rightway/>

## Key Features

- **Context as a store, published in slices**: One provider holds the whole state, but the data, the theme, and the actions each go through their own context. Custom hooks (`useStoreData`, `useStoreTheme` and `useStoreActions`) read them and throw if used outside the provider. Each component re-renders only when the slice it reads changes.
- **Stable actions**: The actions only use functional updates, so they are created once and never change. Components that only write never re-render because of state changes.
- **Memoization where it matters**: The data slice is memoized with `useMemo`, and `React.memo` keeps components from re-rendering when their parent does but their props haven't changed.
- **Immutable state updates**: Immer handles state updates, preventing common bugs related to mutability.
- **Visible re-renders**: Components outline themselves each time they render (`useRenderFlash`), in orange on the light theme and yellow on the dark one.
- **Theming**: A light/dark theme switcher shows how to manage UI state alongside application state. The theme applies to the whole page.

## What to Try

Run the app and watch the outlines:

| Action                       | What re-renders                                           |
| ---------------------------- | --------------------------------------------------------- |
| Click **Click me**           | Only the counter in the footer.                           |
| Type in **Data value**       | Only the form and the view that show the data.            |
| Toggle the theme (top right) | Every outlined component, because they all use the theme. |

`tests/app/renderIsolation.test.tsx` checks each row of this table by counting how often each component flashes.

## Technologies Used

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Immer](https://immerjs.github.io/immer/)
- [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Getting Started

You need Node.js 20.19 or later on the 20.x line, 22.13 or later on the 22.x line, or 24 and later.

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd react-context-rightway
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Type-checks the project, then builds it for production.
- `npm test`: Runs the tests once with Vitest. `npm run test:watch` reruns them on change.
- `npm run test:coverage`: Runs the tests with coverage and fails below 100%.
- `npm run lint`: Lints the code using ESLint. Any warning fails the run. Add `-- --fix` to apply autofixes, such as import sorting.
- `npm run preview`: Serves the production build locally.
- `npm run format`: Formats the code using Prettier.
- `npm run format:check`: Checks formatting without writing.

## Continuous Integration

- **Pull requests** run ESLint and the tests with coverage (`.github/workflows/lint.yml`).
- **Every push to `main`**, including merged pull requests, builds the app and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

## Architecture

The application is structured to separate concerns and demonstrate a clear and maintainable architecture.

### Components

Files in `src/` are grouped by feature. The entry point `main.tsx` and the global `index.css` stay at the root.

- **`app/`**: the application shell.
  - **`App.tsx`**: The root component that sets up the store provider around `Page`.
  - **`Page.tsx`**: Holds the counter state and reads the theme from the store. It lays out the header, the main area with `DataPage`, and the footer. The header has the title on the left, the counter button in the center, and the theme toggle on the right. The footer has the copyright year on the left and the count in the center.
- **`counter/`**: the click counter.
  - **`Counter.tsx`**: Shows the count in the footer. It is memoized, so it re-renders only when the count changes.
- **`pages/`**: the pages shown in the main area.
  - **`DataPage.tsx`**: The data page, a bordered box with the form and the view, centered in the main area. It is memoized, so the counter click skips everything under it; the form and view update only through the store.
- **`store/`**: shared application state.
  - **`StoreContextProvider.tsx`**: The store: the provider, the slice contexts, and their hooks. It also mirrors the theme onto `<html data-theme>` so the whole page switches. This is the heart of the state management pattern.
- **`data/`**: the components that read and update the store's data.
  - **`DataForm.tsx`**: A memoized form for updating the data value.
  - **`DataView.tsx`**: Reads and displays the data value.
- **`theme/`**: the light/dark theme.
  - **`Theme.ts`**: The `Theme` type.
  - **`ToggleThemeButton.tsx`**: Toggles the theme. It is memoized, so it re-renders only when the theme changes.
  - **`useRenderFlash.ts`**: A hook that briefly outlines a component's element after every render, in a colour that contrasts with the theme.
- **`ui/`**: shared components that wrap raw HTML elements. The rest of `src/` uses these instead of the elements directly.
  - **`Box.tsx`**: A `<div>` element.
  - **`Button.tsx`**: A `<button>` that defaults to `type="button"`.
  - **`Footer.tsx`**: A `<footer>` element.
  - **`Header.tsx`**: A `<header>` element.
  - **`Heading.tsx`**: `<h1>` to `<h6>`, picked by the `level` prop.
  - **`Main.tsx`**: A `<main>` element.
  - **`Paragraph.tsx`**: A `<p>` element.
  - **`TextField.tsx`**: An `<input>` wrapped in a `<label>` with the given `label` text.

### Data Flow

1. The `StoreContextProvider` is placed at the top of the component tree in `App.tsx`.
2. `DataForm.tsx` uses the `useStoreActions` hook to get the `setDataValue` function.
3. When the user types in the input field, `setDataValue` updates the store's state using Immer.
4. `DataForm.tsx` and `DataView.tsx` read the new `dataValue` through the `useStoreData` hook and re-render. Nothing else does.
5. The theme toggle calls `toggleTheme` the same way. Every component that reads the theme through `useStoreTheme` re-renders.

### Conventions

ESLint enforces these rules. The configuration in `eslint.config.ts` is deliberately as strict as possible.

- **Imports**: Local files are imported through the `@/` alias, which maps to `src/` (for example `import { useStoreData } from "@/store/StoreContextProvider"`). Relative imports are rejected. Imports are sorted into three groups, separated by a blank line: React, other packages, then local files.
- **Naming**: Every module in `src/` except `main.tsx` exports a binding named exactly like its file, so `DataForm.tsx` exports `DataForm`. A local rule in `eslintRules/` enforces this.
- **HTML elements**: Raw elements are only used inside `src/ui/`. Everywhere else, use the wrapper components.

## License

Released under the [MIT License](LICENSE).
