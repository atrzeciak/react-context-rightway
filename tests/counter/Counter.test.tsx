import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Counter } from "@/counter/Counter";
import { StoreContextProvider } from "@/store/StoreContextProvider";
import { clearFlashes, flashedElements } from "../flashes";

describe("Counter", () => {
  it("shows the count", () => {
    render(<Counter count={3} />, { wrapper: StoreContextProvider });

    expect(screen.getByRole("paragraph")).toHaveTextContent("3");
  });

  it("flashes once on mount", () => {
    render(<Counter count={0} />, { wrapper: StoreContextProvider });

    expect(flashedElements()).toStrictEqual([screen.getByRole("paragraph")]);
  });

  it("re-renders with the new count", () => {
    const { rerender } = render(<Counter count={0} />, { wrapper: StoreContextProvider });
    clearFlashes();

    rerender(<Counter count={1} />);

    expect(screen.getByRole("paragraph")).toHaveTextContent("1");
    expect(flashedElements()).toStrictEqual([screen.getByRole("paragraph")]);
  });

  it("skips re-rendering when the count is unchanged", () => {
    const { rerender } = render(<Counter count={0} />, { wrapper: StoreContextProvider });
    clearFlashes();

    rerender(<Counter count={0} />);

    expect(flashedElements()).toHaveLength(0);
  });
});
