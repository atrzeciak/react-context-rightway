import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("main", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders the app into #root", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.append(root);

    await act(() => import("@/main"));

    expect(root).toContainElement(screen.getByText("React Context - The Right Way"));
  });

  it("fails loudly when #root is missing", async () => {
    await expect(import("@/main")).rejects.toThrow("Root element #root not found");
  });
});
