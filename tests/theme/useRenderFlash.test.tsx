import type { JSX } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StoreContextProvider, useStoreActions } from "@/store/StoreContextProvider";
import { useRenderFlash } from "@/theme/useRenderFlash";
import { Button } from "@/ui/Button";
import { Paragraph } from "@/ui/Paragraph";
import { animate, clearFlashes, flashedElements } from "../flashes";

interface Props {
  text: string;
}

const Flashing = ({ text }: Props): JSX.Element => {
  const ref = useRenderFlash<HTMLParagraphElement>();
  return <Paragraph ref={ref}>{text}</Paragraph>;
};

const Unattached = (): JSX.Element => {
  useRenderFlash<HTMLParagraphElement>();
  return <Paragraph>no ref</Paragraph>;
};

const ThemeToggling = (): JSX.Element => {
  const ref = useRenderFlash<HTMLButtonElement>();
  const { toggleTheme } = useStoreActions();
  return (
    <Button ref={ref} onClick={toggleTheme}>
      toggle
    </Button>
  );
};

const keyframes = (color: string): Keyframe[] => [{ outline: `2px solid ${color}` }, { outline: "2px solid transparent" }];
const timing = { duration: 700, easing: "ease-out" };

describe("useRenderFlash", () => {
  it("outlines the element in orange after mounting in the light theme", () => {
    render(<Flashing text="a" />, { wrapper: StoreContextProvider });

    expect(animate).toHaveBeenCalledExactlyOnceWith(keyframes("orange"), timing);
    expect(flashedElements()).toStrictEqual([screen.getByText("a")]);
  });

  it("outlines the element in yellow in the dark theme", async () => {
    render(<ThemeToggling />, { wrapper: StoreContextProvider });
    clearFlashes();

    await userEvent.click(screen.getByRole("button"));

    expect(animate).toHaveBeenCalledExactlyOnceWith(keyframes("yellow"), timing);
  });

  it("outlines the element again after every re-render", () => {
    const { rerender } = render(<Flashing text="a" />, { wrapper: StoreContextProvider });

    rerender(<Flashing text="b" />);
    rerender(<Flashing text="c" />);

    expect(animate).toHaveBeenCalledTimes(3);
    expect(new Set(flashedElements())).toStrictEqual(new Set([screen.getByText("c")]));
  });

  it("does nothing when the ref is not attached", () => {
    render(<Unattached />, { wrapper: StoreContextProvider });

    expect(animate).not.toHaveBeenCalled();
  });

  it("throws outside StoreContextProvider because it reads the theme", () => {
    vi.spyOn(console, "error").mockImplementation(() => {
      // Silences the log React writes before rethrowing the render error.
    });

    expect(() => render(<Flashing text="a" />)).toThrow("useStoreTheme must be used within StoreContextProvider");
  });
});
