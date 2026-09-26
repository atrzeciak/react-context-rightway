import { type JSX, memo } from "react";

import { useStoreActions, useStoreData } from "@/store/StoreContextProvider";
import { useRenderFlash } from "@/theme/useRenderFlash";
import { Box } from "@/ui/Box";
import { Heading } from "@/ui/Heading";
import { TextField } from "@/ui/TextField";

function DataForm(): JSX.Element {
  const ref = useRenderFlash<HTMLDivElement>();
  const { dataValue } = useStoreData();
  const { setDataValue } = useStoreActions();

  return (
    <Box ref={ref}>
      <Heading level={1}>Data</Heading>
      <TextField
        label="Data value"
        value={dataValue}
        onChange={(event) => {
          setDataValue(event.target.value);
        }}
      />
    </Box>
  );
}

const MemoizedDataForm = memo(DataForm);

export { MemoizedDataForm as DataForm };
