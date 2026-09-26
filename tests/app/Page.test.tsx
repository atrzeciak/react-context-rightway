import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Page } from "@/app/Page";
import { StoreContextProvider } from "@/store/StoreContextProvider";

const renderPage = (): void => {
  render(<Page />, { wrapper: StoreContextProvider });
};

describe("Page", () => {
  it("lays out the header, main area and footer", () => {
    renderPage();

    expect(screen.getByRole("banner")).toHaveTextContent("React Context - The Right Way");
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("textbox", { name: "Data value" }));
    expect(screen.getByRole("contentinfo")).toHaveTextContent(`© ${String(new Date().getFullYear())}`);
  });

  it("starts the counter at zero", () => {
    renderPage();

    expect(screen.getByRole("contentinfo")).toContainElement(screen.getByText("0"));
  });

  it("increments the counter on each click", async () => {
    renderPage();
    const button = screen.getByRole("button", { name: "Click me" });

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("toggles the theme", async () => {
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));

    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("keeps the counter across theme toggles", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));

    await userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("keeps the data value across counter clicks", async () => {
    renderPage();
    await userEvent.type(screen.getByRole("textbox", { name: "Data value" }), "hello");

    await userEvent.click(screen.getByRole("button", { name: "Click me" }));

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("DataView: hello");
  });
});
