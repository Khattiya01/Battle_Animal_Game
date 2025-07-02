import { HTMLInputTypeAttribute } from "react";

type InputFormManageProps = {
  register?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  placeholder: string;
  name: string;
  msgError?: string;
  type?: HTMLInputTypeAttribute | undefined;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
};

const InputFormManage = ({
  register,
  placeholder,
  name,
  msgError,
  type = "text",
  disabled,
  required,
  showLabel = true,
}: InputFormManageProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value) || value === "") {
        event.target.value = value;
      }
    } else if (/^\d*$/.test(value)) {
      event.target.value = value;
    } else if (type === "number") {
      event.target.value = value.replace(/[^0-9]/g, "");
    }
  };
  return (
    <div className=" w-full">
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
      <div
        className={` w-full flex  items-center relative ${
          showLabel ? "mt-1" : ""
        }`}
      >
        <input
          disabled={disabled}
          type={"text"}
          id={name}
          {...register}
          maxLength={type === "to" || type === "tel" ? 10 : undefined}
          placeholder={placeholder}
          onInput={handleInputChange}
          className={`no-spinners border rounded-lg text-black  p-4 w-full h-[44px] focus:border-gray focus:outline-none `}
        />
      </div>
      {msgError && <div className="text-require">{msgError}</div>}
    </div>
  );
};

export default InputFormManage;
