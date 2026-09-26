import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DataPage } from "@/pages/DataPage";
import { StoreContextProvider } from "@/store/StoreContextProvider";
import { clearFlashes, flashedElements } from "../flashes";

describe("DataPage", () => {
  it("shows the form and the view", () => {
    render(<DataPage />, { wrapper: StoreContextProvider });

    expect(screen.getByRole("textbox", { name: "Data value" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("DataView:");
  });

  it("shows what is typed in the form in the view", async () => {
    render(<DataPage />, { wrapper: StoreContextProvider });

    await userEvent.type(screen.getByRole("textbox", { name: "Data value" }), "hello");

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("DataView: hello");
  });

  it("flashes itself and both children on mount", () => {
    render(<DataPage />, { wrapper: StoreContextProvider });

    expect(flashedElements()).toHaveLength(3);
  });

  it("does not re-render itself while typing", async () => {
    render(<DataPage />, { wrapper: StoreContextProvider });
    const field = screen.getByRole("textbox", { name: "Data value" });
    const view = screen.getByRole("heading", { level: 2 });
    clearFlashes();

    await userEvent.type(field, "a");

    const [form, viewFlash] = flashedElements();

    expect(flashedElements()).toHaveLength(2);
    expect(form).toContainElement(field);
    expect(form).not.toContainElement(view);
    expect(viewFlash).toBe(view);
  });

  it("skips re-rendering when its parent re-renders", () => {
    const { rerender } = render(<DataPage />, { wrapper: StoreContextProvider });
    clearFlashes();

    rerender(<DataPage />);

    expect(flashedElements()).toHaveLength(0);
  });
});
