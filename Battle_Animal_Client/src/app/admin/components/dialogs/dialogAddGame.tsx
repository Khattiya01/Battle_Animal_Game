import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonDefault from "@/components/buttons/buttonDefault";
import {
  Insertgame,
  insertGameSchema,
  Selectgame,
  updateGameSchema,
} from "@/db/schemas";
import { Text } from "@radix-ui/themes";
import ButtonOutline from "@/components/buttons/buttonOutline";
import useToastStore, { typeStatusTaost } from "@/hooks/useToastStore";
import { DialogComponent } from "@/components/alertDialogs/dialog.component";
import { BoxLoadingData } from "@/components/boxLoading/BoxLoadingData";
import InputFormManage from "@/components/inputs/inputFormManage";
import { createGameAction, updateGameAction } from "@/actions/games";
import InputTextareaFormManage from "@/components/inputs/inputTextareaFormManage ";
// import UploadField from "@/components/uploadFIle/uploadField";

type DialogAddGameProps = {
  dialogType?: "create" | "edit";
  data: Selectgame | undefined;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
};
const DialogAddGame = ({
  onSuccess,
  onCancel,
  isOpen,
  data,
  dialogType = "create",
}: DialogAddGameProps) => {
  // hooks
  const showToast = useToastStore((state) => state.show);

  // state
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // const LIMITFILE = 1;
  // const [isLoadingUploadFile, setIsLoadingUploadFile] =
  //   useState<boolean>(false);
  // const [activeUploadFileID, setActiveUploadFileID] = useState<string>("");

  // function

  const {
    handleSubmit,
    formState: { errors },
    reset,
    // watch,
    setValue,
    register,
  } = useForm<Insertgame>({
    resolver: zodResolver(data ? updateGameSchema : insertGameSchema),
  });

  const onSubmitHandler = async (payload: Insertgame) => {
    console.log("payload", payload);
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("description", payload?.description ?? "");

    setIsLoadingSubmit(true);
    if (dialogType === "edit" && data?.id) {
      await updateGameAction({ formData: fd, id: data.id })
        .then((res) => {
          if (res?.success) {
            setIsLoadingSubmit(false);
            onSuccess();
            showToast(
              "แก้ไขเกมส์สำเร็จ",
              "",
              new Date(),
              typeStatusTaost.success
            );
            clearData();
          } else {
            setIsLoadingSubmit(false);
            onCancel();
            showToast(
              "แก้ไขเกมส์ไม่สำเร็จ",
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
            "แก้ไขเกมส์ไม่สำเร็จ",
            "",
            new Date(),
            typeStatusTaost.error
          );
        });
    }

    if (dialogType === "create") {
      await createGameAction(fd)
        .then((res) => {
          if (res?.success) {
            setIsLoadingSubmit(false);
            onSuccess();
            showToast(
              "เพิ่มเกมส์สำเร็จ",
              "",
              new Date(),
              typeStatusTaost.success
            );
            clearData();
          } else {
            setIsLoadingSubmit(false);
            onCancel();
            showToast(
              "เพิ่มเกมส์ไม่สำเร็จ",
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
            "เพิ่มเกมส์ไม่สำเร็จ",
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

  const fetchFileData = async (data: Selectgame) => {
    setIsLoadingData(true);
    const preData = {
      id: data.id,
      name: data.name,
      description: data.description,
    };

    setValue("id", data.id);
    setValue("name", preData.name);
    setValue("description", preData.description);
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
      title={data ? "แก้ไขเกมส์" : "เพิ่มเกมส์"}
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
                  name={"ชื่อเกมส์"}
                  placeholder="ชื่อเกมส์"
                  register={{ ...register("name") }}
                  msgError={errors.name?.message}
                  showLabel
                  required
                />
                <InputTextareaFormManage
                  name={"รายละเอียด"}
                  placeholder="รายละเอียด"
                  register={{ ...register("description") }}
                  rows={10}
                  msgError={errors.description?.message}
                  showLabel
                  required
                />
                {/* <Box
                  style={{ gap: 1, display: "flex", flexDirection: "column" }}
                >
                  <label
                    className=" flex gap-1 "
                    htmlFor={"name"}
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "28px",
                    }}
                  >
                    อัปโหลดรูปภาพ หมวดหมู่
                    <div className=" text-red-500">*</div>
                  </label>
                  {isLoadingUploadFile ? (
                    <Spinner size="3" />
                  ) : (
                    <Box
                      style={{
                        display: "flex",
                        gap: "8px",
                        overflowX: "auto",
                        height: "242px",
                        marginTop: "-10px",
                      }}
                      className=" lg:max-w-[976px] max-w-[464px]"
                    >
                      {watch("image_url")?.length < LIMITFILE && (
                        <Box
                          style={{
                            width:
                              watch("image_url")?.length > 0 ? "168px" : "100%",
                            minWidth:
                              watch("image_url")?.length > 0 ? "168px" : "auto",
                            marginTop: "10px",
                          }}
                        >
                          <UploadField
                            id="image_url_id"
                            isError={errors.image_url?.message !== undefined}
                            acceptDescription={".JPEG, .JPG, .PNG"}
                            files={watch("image_url")}
                            onLoading={(loading) =>
                              setIsLoadingUploadFile(loading)
                            }
                            onCheckFileUpload={(f) => {
                              setActiveUploadFileID("image_url_id");
                              onCheckFileUpload(f, watch("image_url")).then(
                                (file) => {
                                  setValue("image_url", file);
                                }
                              );
                            }}
                            acceptOption={{
                              "image/png": [".png"],
                              "image/jpeg": [".jpeg"],
                              "image/webp": [".webp"],
                            }}
                            multiple={false}
                          />
                        </Box>
                      )}
                      {watch("image_url") && watch("image_url")?.length > 0 && (
                        <ListFileCardDragField
                          files={watch("image_url")}
                          setFiles={(f) => setValue("image_url", f)}
                          onClickDelete={(f) => handleDeleteFileBanner(f)}
                        />
                      )}
                    </Box>
                  )}
                  {errors.image_url?.message && (
                    <div className="text-require">
                      {errors.image_url?.message}
                    </div>
                  )}
                </Box> */}
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

export default DialogAddGame;
