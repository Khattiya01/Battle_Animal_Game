import React from "react";
import AlertDialogComponent from "../alertDialogs/alertDialog";
import { Box, Text } from "@radix-ui/themes";
import { RiDeleteBin6Line } from "react-icons/ri";

type DialogDeleteProps = {
  handleClose: () => void;
  handleSubmit: () => void;
  openModalDelete: boolean;
};
const DialogDelete = (props: DialogDeleteProps) => {
  const { handleClose, handleSubmit, openModalDelete } = props;
  return (
    <AlertDialogComponent
      id={"delete"}
      className="  max-w-md"
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      isOpen={openModalDelete}
      title={"คุณต้องการลบข้อมูลหรือไม่?"}
      iconDailog={
        <Box
          style={{
            marginBottom: "8px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <RiDeleteBin6Line
            style={{
              width: "80px",
              height: "80px",
              color: "red",
            }}
          />
        </Box>
      }
      description={
        <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
          หากคุณลบออก คุณจะแก้ไขไม่ได้อีกต่อไป
        </Text>
      }
      btnSubmitName={"ยืนยัน"}
      btnCancelName={"ยกเลิก"}
    />
  );
};

export default DialogDelete;
