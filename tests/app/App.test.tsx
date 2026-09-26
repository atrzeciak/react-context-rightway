import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "@/app/App";

describe("App", () => {
  it("renders the page", () => {
    render(<App />);

    expect(screen.getByText("React Context - The Right Way")).toBeInTheDocument();
  });

  it("provides the store, starting in the light theme", () => {
    render(<App />);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("wires typing through the store to the view", async () => {
    render(<App />);

    await userEvent.type(screen.getByRole("textbox", { name: "Data value" }), "hello");

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("DataView: hello");
  });
});
