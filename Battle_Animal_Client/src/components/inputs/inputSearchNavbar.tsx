"use client";

import { TextField } from "@radix-ui/themes";
import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type InputSearchNavbarProps = {
  placeholder?: string;
};
const InputSearchNavbar = (props: InputSearchNavbarProps) => {
  const { placeholder } = props;
  return (
    <TextField.Root
      onChange={() => {}}
      value={""}
      color="indigo"
      variant="soft"
      placeholder={placeholder}
      size={"3"}
      className=" bg-slate-400"
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
};

export default InputSearchNavbar;
