import React from "react";
import * as Switch from "@radix-ui/react-switch";
import "./styles.css";

type ToggleAdminProps = {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
};
const ToggleAdmin = ({
  onCheckedChange,
  checked,
  disabled,
}: ToggleAdminProps) => {
  return (
    <Switch.Root
      className={`SwitchRoot ${disabled ? "" : "cursor-pointer" }`}
      id="airplane-mode"
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    >
      <Switch.Thumb className="SwitchThumb" />
    </Switch.Root>
  );
};

export default ToggleAdmin;
