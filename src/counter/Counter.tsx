import { type JSX, memo } from "react";

import { useRenderFlash } from "@/theme/useRenderFlash";
import { Paragraph } from "@/ui/Paragraph";

interface Props {
  count: number;
}

function Counter({ count }: Props): JSX.Element {
  const ref = useRenderFlash<HTMLParagraphElement>();
  return <Paragraph ref={ref}>{count}</Paragraph>;
}

const MemoizedCounter = memo(Counter);

export { MemoizedCounter as Counter };
