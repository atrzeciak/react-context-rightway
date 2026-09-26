import type { ComponentProps, JSX } from "react";

export const Button = ({ type = "button", ...props }: ComponentProps<"button">): JSX.Element => <button type={type} {...props} />;
