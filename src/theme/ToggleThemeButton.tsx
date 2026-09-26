import { type JSX, memo } from "react";

import type { Theme } from "@/theme/Theme";
import { useRenderFlash } from "@/theme/useRenderFlash";
import { Button } from "@/ui/Button";

interface Props {
  theme: Theme;
  toggleTheme: () => void;
}

function ToggleThemeButton({ theme, toggleTheme }: Props): JSX.Element {
  const ref = useRenderFlash<HTMLButtonElement>();
  return (
    <Button ref={ref} onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
      {theme === "light" ? "🌚" : "🌝"}
    </Button>
  );
}

const MemoizedToggleThemeButton = memo(ToggleThemeButton);

export { MemoizedToggleThemeButton as ToggleThemeButton };
