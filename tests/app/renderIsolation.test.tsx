import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "@/app/App";
import { clearFlashes, flashedElements } from "../flashes";

// The contract this demo exists for: each interaction re-renders only the components that read what changed.
const renderApp = (): Record<"counter" | "field" | "themeButton" | "view", HTMLElement> => {
  render(<App />);
  const elements = {
    counter: screen.getByText("0"),
    field: screen.getByRole("textbox", { name: "Data value" }),
    themeButton: screen.getByRole("button", { name: "Switch to dark theme" }),
    view: screen.getByRole("heading", { level: 2 }),
  };
  clearFlashes();
  return elements;
};

describe("render isolation", () => {
  it("flashes each of the five components once on mount", () => {
    render(<App />);

    expect(new Set(flashedElements()).size).toBe(5);
    expect(flashedElements()).toHaveLength(5);
  });

  it("re-renders only Counter on a click on Click me", async () => {
    const { counter } = renderApp();

    await userEvent.click(screen.getByRole("button", { name: "Click me" }));

    expect(flashedElements()).toStrictEqual([counter]);
  });

  it("re-renders only DataForm and DataView on each keystroke", async () => {
    const { field, view } = renderApp();

    await userEvent.type(field, "a");

    const [form, viewFlash] = flashedElements();

    expect(flashedElements()).toHaveLength(2);
    expect(form).toContainElement(field);
    expect(form).not.toContainElement(view);
    expect(viewFlash).toBe(view);
  });

  it("re-renders DataForm and DataView once per keystroke", async () => {
    const { field } = renderApp();

    await userEvent.type(field, "hello");

    expect(flashedElements()).toHaveLength(10);
  });

  it("re-renders every flashing component once on a theme toggle", async () => {
    const { counter, field, themeButton, view } = renderApp();

    await userEvent.click(themeButton);

    const flashed = flashedElements();

    expect(flashed).toHaveLength(5);
    expect(new Set(flashed).size).toBe(5);
    expect(flashed).toContain(counter);
    expect(flashed).toContain(themeButton);
    expect(flashed).toContain(view);
    // The other two are DataForm and DataPage, which both contain the field.
    expect(flashed.filter((element) => element.contains(field))).toHaveLength(2);
  });

  it("re-renders nothing on an interaction that changes no state", async () => {
    const { field } = renderApp();
    await userEvent.type(field, "a");
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    clearFlashes();

    await userEvent.click(field);

    expect(flashedElements()).toHaveLength(0);
  });
});
