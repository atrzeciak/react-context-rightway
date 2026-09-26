import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Heading } from "@/ui/Heading";

describe("Heading", () => {
  it.each([1, 2, 3, 4, 5, 6] as const)("renders level %i as a heading of that level", (level) => {
    render(<Heading level={level}>Title</Heading>);

    expect(screen.getByRole("heading", { level, name: "Title" })).toBeInTheDocument();
  });

  it("does not pass level through as an attribute", () => {
    render(<Heading level={2}>Title</Heading>);

    expect(screen.getByRole("heading")).not.toHaveAttribute("level");
  });

  it("passes other props through", () => {
    render(
      <Heading level={1} id="top" className="title">
        Title
      </Heading>,
    );

    expect(screen.getByRole("heading")).toHaveAttribute("id", "top");
    expect(screen.getByRole("heading")).toHaveClass("title");
  });

  it("forwards its ref to the heading element", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading ref={ref} level={3}>
        Title
      </Heading>,
    );

    expect(ref.current).toBe(screen.getByRole("heading", { level: 3 }));
  });
});
