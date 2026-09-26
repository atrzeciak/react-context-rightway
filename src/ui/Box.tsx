import type { ComponentProps, JSX } from "react";

export const Box = (props: ComponentProps<"div">): JSX.Element => <div {...props} />;
