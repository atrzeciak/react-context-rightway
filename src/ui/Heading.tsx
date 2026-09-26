import type { ComponentProps, JSX } from "react";

const tags = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

interface HeadingProps extends ComponentProps<"h1"> {
  level: keyof typeof tags;
}

export const Heading = ({ level, ...props }: HeadingProps): JSX.Element => {
  const Tag = tags[level];
  return <Tag {...props} />;
};
