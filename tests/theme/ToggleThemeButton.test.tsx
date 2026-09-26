import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StoreContextProvider } from "@/store/StoreContextProvider";
import { ToggleThemeButton } from "@/theme/ToggleThemeButton";
import { clearFlashes, flashedElements } from "../flashes";

const toggleTheme = vi.fn<() => void>();

describe("ToggleThemeButton", () => {
  it("offers the dark theme while light", () => {
    render(<ToggleThemeButton theme="light" toggleTheme={toggleTheme} />, { wrapper: StoreContextProvider });

    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toHaveTextContent("🌚");
  });

  it("offers the light theme while dark", () => {
    render(<ToggleThemeButton theme="dark" toggleTheme={toggleTheme} />, { wrapper: StoreContextProvider });

    expect(screen.getByRole("button", { name: "Switch to light theme" })).toHaveTextContent("🌝");
  });

  it("calls toggleTheme when clicked", async () => {
    const toggle = vi.fn<() => void>();
    render(<ToggleThemeButton theme="light" toggleTheme={toggle} />, { wrapper: StoreContextProvider });

    await userEvent.click(screen.getByRole("button"));

    expect(toggle).toHaveBeenCalledOnce();
  });

  it("flashes once on mount", () => {
    render(<ToggleThemeButton theme="light" toggleTheme={toggleTheme} />, { wrapper: StoreContextProvider });

    expect(flashedElements()).toStrictEqual([screen.getByRole("button")]);
  });

  it("skips re-rendering when its props are unchanged", () => {
    const { rerender } = render(<ToggleThemeButton theme="light" toggleTheme={toggleTheme} />, {
      wrapper: StoreContextProvider,
    });
    clearFlashes();

    rerender(<ToggleThemeButton theme="light" toggleTheme={toggleTheme} />);

    expect(flashedElements()).toHaveLength(0);
  });

  it("re-renders when its theme prop changes", () => {
    const { rerender } = render(<ToggleThemeButton theme="light" toggleTheme={toggleTheme} />, {
      wrapper: StoreContextProvider,
    });
    clearFlashes();

    rerender(<ToggleThemeButton theme="dark" toggleTheme={toggleTheme} />);

    expect(flashedElements()).toStrictEqual([screen.getByRole("button")]);
  });
});
