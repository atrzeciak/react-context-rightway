import type { ComponentProps, JSX } from "react";

interface TextFieldProps extends ComponentProps<"input"> {
  label: string;
}

export const TextField = ({ label, ...props }: TextFieldProps): JSX.Element => (
  <label>
    {label} <input {...props} />
  </label>
);
