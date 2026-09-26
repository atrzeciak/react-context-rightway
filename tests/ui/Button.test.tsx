import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/ui/Button";

describe("Button", () => {
  it("renders its children in a button", () => {
    render(<Button>Press</Button>);

    expect(screen.getByRole("button", { name: "Press" })).toBeInTheDocument();
  });

  it("defaults to type button so it never submits a form", () => {
    render(<Button>Press</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("keeps an explicit type", () => {
    render(<Button type="submit">Press</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("passes other props through", () => {
    render(
      <Button aria-label="Close" className="primary" disabled>
        x
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Close" });

    expect(button).toHaveClass("primary");
    expect(button).toBeDisabled();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn<() => void>();
    render(<Button onClick={onClick}>Press</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards its ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Press</Button>);

    expect(ref.current).toBe(screen.getByRole("button"));
  });
});
