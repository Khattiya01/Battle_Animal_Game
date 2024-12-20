import { useForm } from "react-hook-form";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonDefault from "@/components/buttons/buttonDefault";
import { SelectUser } from "@/db/schemas";
import { Text } from "@radix-ui/themes";
import ButtonOutline from "@/components/buttons/buttonOutline";
import useToastStore, { typeStatusTaost } from "@/hooks/useToastStore";
import { DialogComponent } from "@/components/alertDialogs/dialog.component";
import InputFormManage from "@/components/inputs/inputFormManage";
import { postResetPassword } from "@/api/reset-password/reset-password";
import { resetPasswordType } from "@/types/requests/resetPassword";
import { resetPasswordSchema } from "@/schemas/resetPassword";

type DialogResetPasswordProps = {
  data: SelectUser | undefined;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
};
const DialogResetPassword = ({
  onSuccess,
  onCancel,
  isOpen,
  data,
}: DialogResetPasswordProps) => {
  // hooks
  const showToast = useToastStore((state) => state.show);

  // state
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);

  // function

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<resetPasswordType>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (payload: resetPasswordType) => {
    setIsLoadingSubmit(true);

    await postResetPassword({
      password: payload.password,
      userId: data?.id ?? "",
    })
      .then(() => {
        setIsLoadingSubmit(false);
        onSuccess();
        showToast(
          "แก้ไขรหัสผ่านผู้ใช้งานสำเร็จ",
          "",
          new Date(),
          typeStatusTaost.success
        );
        clearData();
      })
      .catch((err) => {
        console.error("Error reset password:", err?.message);
        setIsLoadingSubmit(false);
        showToast(
          "แก้ไขรหัสผ่านผู้ใช้งานไม่สำเร็จ",
          "",
          new Date(),
          typeStatusTaost.error
        );
      });
  };

  const onCancelHandler = () => {
    defaultValue();
    onCancel();
  };

  const clearData = () => {
    defaultValue();
  };

  const defaultValue = () => {
    reset();
  };

  return (
    <>
      <DialogComponent
        isOpen={isOpen}
        className=" lg:max-w-5xl sm:max-w-lg"
        title={"แก้ไขรหัสผ่านผู้ใช้งาน"}
        content={
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full text-xl sm:h-[calc(100vh-216px)] h-[calc(100vh-126px)] overflow-y-auto flex flex-col justify-between"
          >
            <div className=" flex flex-col w-full pl-1 pr-1 ">
              <div className=" flex gap-6 flex-col ">
                <InputFormManage
                  name={"รหัสผ่านใหม่"}
                  placeholder="รหัสผ่านใหม่"
                  register={{ ...register("password") }}
                  msgError={errors.password?.message}
                  showLabel
                  required
                />
                <InputFormManage
                  name={"ยืนยันรหัสผ่านใหม่"}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  register={{ ...register("confirmPassword") }}
                  msgError={errors.confirmPassword?.message}
                  showLabel
                  required
                />
                {/* <InputFormPassword
                  placeholder="รหัสผ่านใหม่"
                  onChange={(value) => {
                    setValue("password", value);
                  }}
                  value={watch("password")}
                  errorMessage={errors.password?.message}
                  showIconRight={false}
                />
                <InputFormPassword
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  onChange={(value) => {
                    setValue("confirmPassword", value);
                  }}
                  value={watch("confirmPassword")}
                  errorMessage={errors.confirmPassword?.message}
                  showIconRight={false}
                /> */}
              </div>
            </div>
            <div className="flex gap-2 w-full sm:justify-end justify-center text-xl mt-4 ">
              <ButtonOutline
                disable={isLoadingSubmit}
                type="button"
                onClick={() => onCancelHandler()}
                width="140px"
              >
                <Text className=" text-base ">ยกเลิก</Text>
              </ButtonOutline>
              <ButtonDefault
                type="submit"
                width="140px"
                onClick={() => {}}
                isLoading={isLoadingSubmit}
              >
                <Text className=" text-base ">ยืนยัน</Text>
              </ButtonDefault>
            </div>
          </form>
        }
      />
    </>
  );
};

export default DialogResetPassword;
