import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TextField } from "@/ui/TextField";

describe("TextField", () => {
  it("labels its input", () => {
    render(<TextField label="Name" />);

    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("does not pass label through as an attribute", () => {
    render(<TextField label="Name" />);

    expect(screen.getByRole("textbox")).not.toHaveAttribute("label");
  });

  it("shows its value", () => {
    render(<TextField label="Name" value="Ada" readOnly />);

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  });

  it("reports every keystroke through onChange", async () => {
    const onChange = vi.fn<(value: string) => void>();
    render(
      <TextField
        label="Name"
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />,
    );

    await userEvent.type(screen.getByRole("textbox"), "Ada");

    expect(onChange.mock.calls).toStrictEqual([["A"], ["Ad"], ["Ada"]]);
  });

  it("passes other props through to the input", () => {
    render(<TextField label="Name" placeholder="Your name" disabled />);

    expect(screen.getByPlaceholderText("Your name")).toBeDisabled();
  });

  it("forwards its ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} label="Name" />);

    expect(ref.current).toBe(screen.getByRole("textbox"));
  });
});
