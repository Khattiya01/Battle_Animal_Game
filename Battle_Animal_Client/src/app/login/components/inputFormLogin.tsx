import { TextField } from "@radix-ui/themes";
import React, { ReactNode } from "react";

type InputFormLoginProps = {
  placeholder?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
};
const InputFormLogin = (props: InputFormLoginProps) => {
  const { placeholder, iconLeft, iconRight, value, onChange, errorMessage } =
    props;
  return (
    <div>
      <TextField.Root
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
        size={"3"}
      >
        <TextField.Slot>{iconLeft}</TextField.Slot>
        <TextField.Slot>{iconRight}</TextField.Slot>
      </TextField.Root>
      {errorMessage && (
        <div className=" text-red-600 text-xs mt-1 ">{errorMessage}</div>
      )}
    </div>
  );
};

export default InputFormLogin;
