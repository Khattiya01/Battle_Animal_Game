import { TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";

type InputFormPasswordProps = {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  errorMessage?: string;
};
const InputFormPassword = (props: InputFormPasswordProps) => {
  const { placeholder, onChange, value, errorMessage } = props;

  const [isShowPassword, setIsShowPassword] = useState(true);
  return (
    <div>
      <TextField.Root
        type={isShowPassword ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size={"3"}
      >
        <TextField.Slot>
          <RiLockPasswordFill size={"22px"} className=" text-[#00337d]" />
        </TextField.Slot>
        <TextField.Slot onClick={() => setIsShowPassword(!isShowPassword)}>
          {isShowPassword ? (
            <IoMdEyeOff
              size={"22px"}
              className=" cursor-pointer  text-[#00337d]"
            />
          ) : (
            <IoMdEye
              size={"22px"}
              className=" cursor-pointer  text-[#00337d]"
            />
          )}
        </TextField.Slot>
      </TextField.Root>
      {errorMessage && (
        <div className=" text-red-600 text-xs mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default InputFormPassword;
