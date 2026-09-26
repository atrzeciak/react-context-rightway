import { vi } from "vitest";

// jsdom has no Web Animations API. useRenderFlash calls animate() once per render, so this mock counts renders.
export const animate = vi.fn<Element["animate"]>();

// Elements outlined since the last clearFlashes(): one entry per render, in effect order.
export const flashedElements = (): Element[] => animate.mock.contexts.filter((context) => context instanceof Element);

export const clearFlashes = (): void => {
  animate.mockClear();
};
