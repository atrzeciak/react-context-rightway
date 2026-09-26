import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { animate, clearFlashes } from "./flashes";

Element.prototype.animate = animate;

afterEach(() => {
  cleanup();
  clearFlashes();
  delete document.documentElement.dataset.theme;
});
