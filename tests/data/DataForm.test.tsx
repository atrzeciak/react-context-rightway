import type { JSX } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DataForm } from "@/data/DataForm";
import { StoreContextProvider, useStoreData } from "@/store/StoreContextProvider";
import { Paragraph } from "@/ui/Paragraph";
import { clearFlashes, flashedElements } from "../flashes";

const StoredValue = (): JSX.Element => {
  const { dataValue } = useStoreData();
  return <Paragraph>stored: {dataValue}</Paragraph>;
};

describe("DataForm", () => {
  it("shows a heading and an empty data field", () => {
    render(<DataForm />, { wrapper: StoreContextProvider });

    expect(screen.getByRole("heading", { level: 1, name: "Data" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Data value" })).toHaveValue("");
  });

  it("writes what is typed to the store", async () => {
    render(
      <>
        <DataForm />
        <StoredValue />
      </>,
      { wrapper: StoreContextProvider },
    );

    await userEvent.type(screen.getByRole("textbox", { name: "Data value" }), "hello");

    expect(screen.getByRole("paragraph")).toHaveTextContent("stored: hello");
  });

  it("shows the store value in the field", async () => {
    render(<DataForm />, { wrapper: StoreContextProvider });
    const field = screen.getByRole("textbox", { name: "Data value" });

    await userEvent.type(field, "hello");
    await userEvent.type(field, "{Backspace}{Backspace}");

    expect(field).toHaveValue("hel");
  });

  it("re-renders once per keystroke", async () => {
    render(<DataForm />, { wrapper: StoreContextProvider });
    clearFlashes();

    await userEvent.type(screen.getByRole("textbox"), "abc");

    expect(flashedElements()).toHaveLength(3);
  });

  it("skips re-rendering when its parent re-renders", () => {
    const { rerender } = render(<DataForm />, { wrapper: StoreContextProvider });
    clearFlashes();

    rerender(<DataForm />);

    expect(flashedElements()).toHaveLength(0);
  });
});
