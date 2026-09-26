/* eslint-disable react-refresh/only-export-components */
import { createContext, type JSX, type PropsWithChildren, use, useEffect, useMemo, useState } from "react";

import { produce } from "immer";

import type { Theme } from "@/theme/Theme";

interface StoreState {
  dataValue: string;
  theme: Theme;
}

interface StoreActions {
  setDataValue: (newDataValue: string) => void;
  toggleTheme: () => void;
}

const initialState: StoreState = {
  dataValue: "",
  theme: "light",
};

interface StoreData {
  dataValue: string;
}

// One store, published in slices: each component re-renders only when the slice it reads changes.
const StoreDataContext = createContext<StoreData | undefined>(undefined);
const StoreThemeContext = createContext<Theme | undefined>(undefined);
const StoreActionsContext = createContext<StoreActions | undefined>(undefined);

export const StoreContextProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [state, setState] = useState<StoreState>(initialState);

  // The theme styles the whole document, so mirror it onto <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  // Actions only use functional updates, so they are created once and stay stable.
  const actions = useMemo<StoreActions>(
    () => ({
      setDataValue: (newDataValue: string): void => {
        setState(
          produce((draft) => {
            draft.dataValue = newDataValue;
          }),
        );
      },
      toggleTheme: (): void => {
        setState(
          produce((draft) => {
            draft.theme = draft.theme === "light" ? "dark" : "light";
          }),
        );
      },
    }),
    [],
  );

  const data = useMemo<StoreData>(() => ({ dataValue: state.dataValue }), [state.dataValue]);

  return (
    <StoreActionsContext value={actions}>
      <StoreThemeContext value={state.theme}>
        <StoreDataContext value={data}>{children}</StoreDataContext>
      </StoreThemeContext>
    </StoreActionsContext>
  );
};

export const useStoreData = (): StoreData => {
  const data = use(StoreDataContext);

  if (!data) {
    throw new Error("useStoreData must be used within StoreContextProvider");
  }

  return data;
};

export const useStoreTheme = (): Theme => {
  const theme = use(StoreThemeContext);

  if (theme === undefined) {
    throw new Error("useStoreTheme must be used within StoreContextProvider");
  }

  return theme;
};

export const useStoreActions = (): StoreActions => {
  const actions = use(StoreActionsContext);

  if (!actions) {
    throw new Error("useStoreActions must be used within StoreContextProvider");
  }

  return actions;
};
