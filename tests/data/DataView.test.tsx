import type { JSX } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DataView } from "@/data/DataView";
import { StoreContextProvider, useStoreActions } from "@/store/StoreContextProvider";
import { Button } from "@/ui/Button";
import { clearFlashes, flashedElements } from "../flashes";

const SetValue = (): JSX.Element => {
  const { setDataValue } = useStoreActions();
  return (
    <Button
      onClick={() => {
        setDataValue("hello");
      }}
    >
      set
    </Button>
  );
};

const renderView = (): void => {
  render(
    <>
      <DataView />
      <SetValue />
    </>,
    { wrapper: StoreContextProvider },
  );
};

describe("DataView", () => {
  it("shows the empty data value as a level 2 heading", () => {
    renderView();

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/^DataView:$/u);
  });

  it("shows the data value from the store", async () => {
    renderView();

    await userEvent.click(screen.getByRole("button", { name: "set" }));

    expect(screen.getByRole("heading", { level: 2, name: "DataView: hello" })).toBeInTheDocument();
  });

  it("re-renders when the data value changes", async () => {
    renderView();
    clearFlashes();

    await userEvent.click(screen.getByRole("button", { name: "set" }));

    expect(flashedElements()).toStrictEqual([screen.getByRole("heading", { level: 2 })]);
  });

  it("skips re-rendering when the data value is set to the same string", async () => {
    renderView();
    await userEvent.click(screen.getByRole("button", { name: "set" }));
    clearFlashes();

    await userEvent.click(screen.getByRole("button", { name: "set" }));

    expect(flashedElements()).toHaveLength(0);
  });
});
