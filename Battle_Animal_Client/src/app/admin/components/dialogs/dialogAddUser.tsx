import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonDefault from "@/components/buttons/buttonDefault";
import { insertUserSchema, SelectUser, updateUserSchema } from "@/db/schemas";
import { Text } from "@radix-ui/themes";
import ButtonOutline from "@/components/buttons/buttonOutline";
import useToastStore, { typeStatusTaost } from "@/hooks/useToastStore";
import { DialogComponent } from "@/components/alertDialogs/dialog.component";
import { BoxLoadingData } from "@/components/boxLoading/BoxLoadingData";
import SelectComponents from "@/components/selects/selectComponents";
import { CreateUserType } from "@/types/requests/createUser";
import { createUserAction, updateUserAction } from "@/actions/users";
import { ROLEOPTION } from "@/utils/optionRole";
import InputFormManage from "@/components/inputs/inputFormManage";

type DialogAddUserProps = {
  dialogType?: "create" | "edit";
  data: SelectUser | undefined;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
};
const DialogAddUser = ({
  onSuccess,
  onCancel,
  isOpen,
  data,
  dialogType = "create",
}: DialogAddUserProps) => {
  // hooks
  const showToast = useToastStore((state) => state.show);

  // state
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // function

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    register,
  } = useForm<CreateUserType>({
    defaultValues: {
      role: "admin",
    },
    resolver: zodResolver(data ? updateUserSchema : insertUserSchema),
  });

  const onSubmitHandler = async (payload: CreateUserType) => {
    console.log("payload" , payload)
    const fd = new FormData();
    fd.append("username", payload.username);
    fd.append("password", payload.password);
    fd.append("email", payload.email);
    fd.append("role", payload.role);

    setIsLoadingSubmit(true);
    if (dialogType === "edit" && data?.id) {
      await updateUserAction({ formData: fd, id: data.id })
        .then((res) => {
          if (res?.success) {
            setIsLoadingSubmit(false);
            onSuccess();
            showToast(
              "แก้ไขผู้ใช้งานสำเร็จ",
              "",
              new Date(),
              typeStatusTaost.success
            );
            clearData();
          } else {
            setIsLoadingSubmit(false);
            onCancel();
            showToast(
              "แก้ไขผู้ใช้งานไม่สำเร็จ",
              "",
              new Date(),
              typeStatusTaost.error
            );
            clearData();
          }
        })
        .catch((err) => {
          console.error("Error create logo:", err?.message);
          setIsLoadingSubmit(false);
          showToast(
            "แก้ไขผู้ใช้งานไม่สำเร็จ",
            "",
            new Date(),
            typeStatusTaost.error
          );
        });
    }

    if (dialogType === "create") {
      await createUserAction(fd)
        .then((res) => {
          if (res?.success) {
            setIsLoadingSubmit(false);
            onSuccess();
            showToast(
              "เพิ่มผู้ใช้งานสำเร็จ",
              "",
              new Date(),
              typeStatusTaost.success
            );
            clearData();
          } else {
            setIsLoadingSubmit(false);
            onCancel();
            showToast(
              "เพิ่มผู้ใช้งานไม่สำเร็จ",
              "",
              new Date(),
              typeStatusTaost.error
            );
            clearData();
          }
        })
        .catch((err) => {
          console.error("Error create logo:", err?.message);
          setIsLoadingSubmit(false);
          showToast(
            "เพิ่มผู้ใช้งานไม่สำเร็จ",
            "",
            new Date(),
            typeStatusTaost.error
          );
        });
    }
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

  const fetchFileData = async (data: SelectUser) => {
    setIsLoadingData(true);
    const preData = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };

    setValue("id", data.id);
    setValue("username", preData.username);
    setValue("email", preData.email);
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (data && isOpen) {
      fetchFileData(data);
    }
  }, [data, isOpen]);


  return (
    <DialogComponent
      isOpen={isOpen}
      className=" lg:max-w-5xl sm:max-w-lg"
      title={data ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
      content={
        dialogType === "edit" && isLoadingData ? (
          <BoxLoadingData minHeight="666px" />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="w-full text-xl sm:h-[calc(100vh-216px)] h-[calc(100vh-126px)] overflow-y-auto flex flex-col justify-between"
          >
            <div className=" flex flex-col w-full pl-1 pr-1 ">
              <div className=" flex gap-6 flex-col ">
                <InputFormManage
                  name={"ชื่อผู้ใช้งาน"}
                  placeholder="ชื่อผู้ใช้งาน"
                  register={{ ...register("username") }}
                  msgError={errors.username?.message}
                  showLabel
                  required
                />
                {data ? null : (
                  <InputFormManage
                    name={"รหัสผ่าน"}
                    placeholder="รหัสผ่าน"
                    register={{ ...register("password") }}
                    msgError={errors.password?.message}
                    showLabel
                    required
                  />
                )}
                <InputFormManage
                  name={"อีเมล"}
                  placeholder="อีเมล"
                  register={{ ...register("email") }}
                  msgError={errors.email?.message}
                  showLabel
                  required
                  type="email"
                />
                <SelectComponents
                  option={ROLEOPTION}
                  defaultValue={watch("role") ?? ROLEOPTION[0]?.value ?? ""}
                  onValueChange={(value) => setValue("role", value)}
                  name={"บทบาท"}
                  required
                  showLabel
                />
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
                <Text className=" text-base ">{data ? "ยืนยัน" : "สร้าง"}</Text>
              </ButtonDefault>
            </div>
          </form>
        )
      }
    />
  );
};

export default DialogAddUser;
