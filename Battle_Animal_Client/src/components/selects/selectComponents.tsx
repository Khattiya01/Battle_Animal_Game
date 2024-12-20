import React from "react";

type SelectComponentsProps = {
  option: { value: string; label: string }[];
  defaultValue: string;
  onValueChange: (value: string) => void;
  showLabel?: boolean;
  required?: boolean;
  name: string;
};
const SelectComponents = ({
  option,
  defaultValue,
  onValueChange,
  showLabel,
  name,
  required,
}: SelectComponentsProps) => {
  return (
    <div>
      {showLabel && (
        <label
          className=" flex gap-1 "
          htmlFor={name}
          style={{
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "28px",
          }}
        >
          {name} {required && <div className=" text-red-500">*</div>}
        </label>
      )}
      <select
        id={name}
        value={defaultValue}
        onChange={(e) => onValueChange(e.target.value)}
        className={` h-11 w-full rounded-lg px-[10px]  text-base ${
          showLabel ? "mt-1" : ""
        }`}
        style={{ border: "1px solid #ccc" }}
      >
        {option && option?.length > 0 ? (
          option.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))
        ) : (
          <option value="" disabled>
            not option
          </option>
        )}
      </select>
    </div>
  );
};

export default SelectComponents;
