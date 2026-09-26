import type { JSX } from "react";

import { Page } from "@/app/Page";
import { StoreContextProvider } from "@/store/StoreContextProvider";

export default function App(): JSX.Element {
  return (
    <StoreContextProvider>
      <Page />
    </StoreContextProvider>
  );
}
