import { type JSX, memo } from "react";

import { DataForm } from "@/data/DataForm";
import { DataView } from "@/data/DataView";
import { useRenderFlash } from "@/theme/useRenderFlash";
import { Box } from "@/ui/Box";

function DataPage(): JSX.Element {
  const ref = useRenderFlash<HTMLDivElement>();

  return (
    <Box ref={ref} className="data-page">
      <DataForm />
      <DataView />
    </Box>
  );
}

// Memoized so parent re-renders (the counter) skip the data components; they update only through the store.
const MemoizedDataPage = memo(DataPage);

export { MemoizedDataPage as DataPage };
