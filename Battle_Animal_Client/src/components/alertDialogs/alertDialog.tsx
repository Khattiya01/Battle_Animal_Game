"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";
import { Box, Text } from "@radix-ui/themes";
import ButtonDefault from "../buttons/buttonDefault";
import ButtonOutline from "../buttons/buttonOutline";

type AlertDialogComponentProps = {
  id?: string;
  isOpen: boolean;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  handleClose: () => void;
  handleSubmit: () => void;
  btnSubmitName?: string;
  btnCancelName?: string;
  iconDailog?: ReactNode;
};

const AlertDialogComponent = ({
  id,
  isOpen,
  className,
  title,
  description,
  handleClose,
  handleSubmit,
  btnCancelName,
  btnSubmitName,
  iconDailog,
}: AlertDialogComponentProps) => {
  return (
    // <Dialog
    //   open={open}
    //   onClose={hideCloseIcon ? undefined : handleClose}
    //   sx={{
    //     zIndex: (theme) => theme.zIndex.drawer + 1,
    //     "& .MuiDialog-container": {
    //       "& .MuiPaper-root": {
    //         width: "auto",
    //         minWidth: "343px",
    //         maxWidth: maxWidth ?? "",
    //       },
    //     },
    //   }}
    //   // fullScreen={fullScreen}
    // >
    //   <Box
    //     sx={{
    //       padding: "24px 16px 0 16px",
    //       textAlign: "center",
    //       position: "relative",
    //     }}
    //   >
    //     {iconDailog}
    //     <Typography
    //       sx={{
    //         fontWeight: "600",
    //         fontSize: "22px",
    //         lineHeight: "32px",
    //         minHeight: "32px",
    //       }}
    //     >
    //       {title}
    //     </Typography>
    //     {!hideCloseIcon && (
    //       <Box
    //         sx={{
    //           width: "44px",
    //           height: "44px",
    //           position: "absolute",
    //           right: 10,
    //           top: 10,
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <IconButton
    //           onClick={handleClose}
    //           sx={{
    //             padding: 0,
    //           }}
    //         >
    //           <CloseIcon sx={{ width: "24px", height: "24px" }} />
    //         </IconButton>
    //       </Box>
    //     )}
    //   </Box>
    //   <Box
    //     sx={{
    //       mt: "8px",
    //       mb: "16px",
    //       padding: "0 16px 0 16px",
    //       display: "flex",
    //       flexDirection: "column",
    //       gap: "16px",
    //       alignItems: "center",
    //       fontSize: "16px",
    //       lineHeight: "24px",
    //     }}
    //   >
    //     {description}
    //   </Box>

    //   <Box
    //     sx={{
    //       width: "100%",
    //       padding: "10px 16px 10px 16px",
    //       display: "flex",
    //       flexDirection: "column",
    //       gap: "12px",
    //     }}
    //   >
    //     <FormButton
    //       id={id}
    //       name={btnSubmitName ?? "ยืนยัน"}
    //       onClick={handleSubmit}
    //     />
    //     {!hideCloseBtn && (
    //       <FormButton
    //         variant="outlined"
    //         type="button"
    //         name={btnCancelName ?? "ยกเลิก"}
    //         onClick={handleClose}
    //       />
    //     )}
    //   </Box>
    // </Dialog>
    <AlertDialog open={isOpen}>
      <AlertDialogContent className={`${className} AlertDialogContent`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="AlertDialogTitle">
            {iconDailog}
            <div className=" text-2xl text-center">{title}</div>
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription text-base text-black text-center">
            {/* <div className="  text-base text-black text-center"> */}
            {description}
            {/* </div> */}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center">
          <Box
            style={{
              width: "100%",
              padding: "10px 16px 10px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <ButtonDefault
              id={id}
              type="submit"
              width="calc(100% - 34px)"
              onClick={handleSubmit}
            >
              <Text className=" text-base ">{btnSubmitName}</Text>
            </ButtonDefault>
            <ButtonOutline
              type="button"
              onClick={handleClose}
              width="calc(100% - 34px)"
            >
              <Text className=" text-base ">{btnCancelName}</Text>
            </ButtonOutline>
          </Box>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
