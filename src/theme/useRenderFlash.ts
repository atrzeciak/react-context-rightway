import { type RefObject, useEffect, useRef } from "react";

import { useStoreTheme } from "@/store/StoreContextProvider";

// Contrasting outline colour per theme; reading the theme also makes every flashing component re-render on toggle.
const flashColor = { light: "orange", dark: "yellow" } as const;

// Outlines the element briefly after every render of the component that owns the ref.
export const useRenderFlash = <T extends HTMLElement>(): RefObject<T | null> => {
  const ref = useRef<T>(null);
  const color = flashColor[useStoreTheme()];

  useEffect(() => {
    ref.current?.animate([{ outline: `2px solid ${color}` }, { outline: "2px solid transparent" }], {
      duration: 700,
      easing: "ease-out",
    });
  });

  return ref;
};
