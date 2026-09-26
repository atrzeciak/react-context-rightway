import { act, render, renderHook, type RenderHookResult, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StoreContextProvider, useStoreActions, useStoreData, useStoreTheme } from "@/store/StoreContextProvider";
import type { Theme } from "@/theme/Theme";

interface Store {
  data: ReturnType<typeof useStoreData>;
  theme: Theme;
  actions: ReturnType<typeof useStoreActions>;
}

const useStore = (): Store => ({ data: useStoreData(), theme: useStoreTheme(), actions: useStoreActions() });

const renderStore = (): RenderHookResult<Store, unknown> => renderHook(useStore, { wrapper: StoreContextProvider });

describe("StoreContextProvider", () => {
  it("renders its children", () => {
    render(<StoreContextProvider>child</StoreContextProvider>);

    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("starts with an empty data value and the light theme", () => {
    const { result } = renderStore();

    expect(result.current.data).toStrictEqual({ dataValue: "" });
    expect(result.current.theme).toBe("light");
  });

  it("mirrors the theme onto <html data-theme>", () => {
    const { result } = renderStore();

    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    act(() => {
      result.current.actions.toggleTheme();
    });

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("toggles the theme back and forth", () => {
    const { result } = renderStore();

    act(() => {
      result.current.actions.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.actions.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });

  it("sets the data value", () => {
    const { result } = renderStore();

    act(() => {
      result.current.actions.setDataValue("hello");
    });

    expect(result.current.data.dataValue).toBe("hello");
  });

  it("keeps the theme when the data value changes", () => {
    const { result } = renderStore();
    act(() => {
      result.current.actions.toggleTheme();
    });

    act(() => {
      result.current.actions.setDataValue("hello");
    });

    expect(result.current.theme).toBe("dark");
  });

  it("keeps the data value when the theme changes", () => {
    const { result } = renderStore();
    act(() => {
      result.current.actions.setDataValue("hello");
    });

    act(() => {
      result.current.actions.toggleTheme();
    });

    expect(result.current.data.dataValue).toBe("hello");
  });

  describe("slice identity", () => {
    it("keeps the same actions object across every update", () => {
      const { result } = renderStore();
      const { actions } = result.current;

      act(() => {
        actions.setDataValue("hello");
        actions.toggleTheme();
      });

      expect(result.current.actions).toBe(actions);
    });

    it("keeps the same data object when only the theme changes", () => {
      const { result } = renderStore();
      const { data } = result.current;

      act(() => {
        result.current.actions.toggleTheme();
      });

      expect(result.current.data).toBe(data);
    });

    it("publishes a new data object when the data value changes", () => {
      const { result } = renderStore();
      const { data } = result.current;

      act(() => {
        result.current.actions.setDataValue("hello");
      });

      expect(result.current.data).not.toBe(data);
    });

    it("keeps the same data object when the data value is set to the same string", () => {
      const { result } = renderStore();
      act(() => {
        result.current.actions.setDataValue("hello");
      });
      const { data } = result.current;

      act(() => {
        result.current.actions.setDataValue("hello");
      });

      expect(result.current.data).toBe(data);
    });
  });
});

describe.each<{ hook: () => unknown; name: string }>([
  { hook: useStoreData, name: "useStoreData" },
  { hook: useStoreTheme, name: "useStoreTheme" },
  { hook: useStoreActions, name: "useStoreActions" },
])("$name", ({ hook, name }) => {
  it("throws outside StoreContextProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {
      // Silences the log React writes before rethrowing the render error.
    });

    expect(() => renderHook(hook)).toThrow(`${name} must be used within StoreContextProvider`);
  });
});
