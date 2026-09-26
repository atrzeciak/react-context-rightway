import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Box } from "@/ui/Box";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { Main } from "@/ui/Main";
import { Paragraph } from "@/ui/Paragraph";

// Each wrapper renders one raw element and passes every prop through.
describe.each([
  { name: "Box", Wrapper: Box, element: HTMLDivElement },
  { name: "Footer", Wrapper: Footer, element: HTMLElement },
  { name: "Header", Wrapper: Header, element: HTMLElement },
  { name: "Main", Wrapper: Main, element: HTMLElement },
  { name: "Paragraph", Wrapper: Paragraph, element: HTMLParagraphElement },
])("$name", ({ Wrapper, element }) => {
  it("renders its children", () => {
    render(<Wrapper>content</Wrapper>);

    expect(screen.getByText("content")).toBeInstanceOf(element);
  });

  it("passes props through", () => {
    render(
      <Wrapper className="styled" title="tip">
        content
      </Wrapper>,
    );

    expect(screen.getByTitle("tip")).toHaveClass("styled");
  });

  it("forwards its ref to the element", () => {
    // Assignable to every wrapper's ref type.
    const ref = createRef<HTMLDivElement & HTMLParagraphElement>();
    render(<Wrapper ref={ref}>content</Wrapper>);

    expect(ref.current).toBe(screen.getByText("content"));
  });
});

describe("landmarks", () => {
  it.each([
    { name: "Header", Wrapper: Header, role: "banner" },
    { name: "Main", Wrapper: Main, role: "main" },
    { name: "Footer", Wrapper: Footer, role: "contentinfo" },
  ])("$name is the $role landmark", ({ Wrapper, role }) => {
    render(<Wrapper>content</Wrapper>);

    expect(screen.getByRole(role)).toHaveTextContent("content");
  });

  it("Paragraph has the paragraph role", () => {
    render(<Paragraph>content</Paragraph>);

    expect(screen.getByRole("paragraph")).toHaveTextContent("content");
  });
});
