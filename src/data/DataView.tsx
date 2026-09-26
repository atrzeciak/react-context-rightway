import type { JSX } from "react";

import { useStoreData } from "@/store/StoreContextProvider";
import { useRenderFlash } from "@/theme/useRenderFlash";
import { Heading } from "@/ui/Heading";

const DataView = (): JSX.Element => {
  const ref = useRenderFlash<HTMLHeadingElement>();
  const { dataValue } = useStoreData();

  return (
    <Heading ref={ref} level={2}>
      DataView: {dataValue}
    </Heading>
  );
};

export { DataView };
