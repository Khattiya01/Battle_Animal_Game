import React from "react";

import { Reorder, AnimatePresence, motion } from "framer-motion";
// import ErrorField from "./errorField";
// import CardsFile from "./cardsFile";
import { Box } from "@radix-ui/themes";
import { IoIosClose } from "react-icons/io";
import ErrorField from "./errorField";
import Image from "next/image";
import { blobToFile } from "@/types/file";

type ListFileCardFieldProps = {
  files: blobToFile[];
  setFiles: (files: blobToFile[]) => void;
  onClickDelete: (file: blobToFile) => void;
  type?: "logo" | undefined;
};
const ListFileCardDragField = (props: ListFileCardFieldProps) => {
  const { files, setFiles, onClickDelete, type } = props;

  return (
    <Box>
      <Reorder.Group
        as="ul"
        axis="x"
        onReorder={setFiles}
        values={files}
        className=" flex gap-[8px] h-[235px] pt-[10px]"
      >
        <AnimatePresence initial={false}>
          {files?.map((file) => (
            <div key={file?.id}>
              <Box
                key={file?.id}
                style={{ position: "relative" }}
                className=" sm:hidden block"
              >
                <motion.span
                  layout="position"
                  style={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "0px",
                    width: type ? "auto" : "168px",
                    height: type ? "auto" : "225px",
                    maxHeight: type ? "auto" : "225px",
                    overflow: "hidden",
                  }}
                >
                  {file?.error ? (
                    <ErrorField />
                  ) : (
                    <>
                      {type === "logo" ? (
                        <CardLogo imageURL={file?.imageURL} />
                      ) : (
                        <CardImage imageURL={file?.imageURL} />
                      )}
                    </>
                  )}
                  <Box
                    onClick={() => {
                      onClickDelete(file);
                    }}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 32,
                      height: 32,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "8px",
                      cursor: "pointer",
                      boxShadow: "0px 3.6px 12px 0px rgba(132, 147, 198, 0.12)",
                    }}
                  >
                    <IoIosClose
                      style={{
                        width: "16px",
                        height: "16px",
                        minWidth: "16px",
                      }}
                    />
                  </Box>
                </motion.span>
              </Box>

              {/* <Reorder.Item
                value={file}
                key={file?.id}
                id={file?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  backgroundColor: "#fff",
                  y: 0,
                  transition: { duration: 0.15 },
                }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                whileDrag={{
                  backgroundColor: "transparent",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  borderRadius: "8px",
                }}
                style={{
                  position: "relative",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                }}
                className=" sm:block hidden"
              >
                <motion.span
                  layout="position"
                  style={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "0px",
                    width: "168px",
                    height: "225px",
                    maxHeight: "225px",
                  }}
                >
                  {file?.error ? <ErrorField /> : <CardImage imageURL={file?.imageURL} />}
                  <Box
                    onClick={() => onClickDelete(file)}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 32,
                      height: 32,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "8px",
                      cursor: "pointer",
                      boxShadow: "0px 3.6px 12px 0px rgba(132, 147, 198, 0.12)",
                    }}
                  >
                    <IoIosClose
                      style={{
                        width: "16px",
                        height: "16px",
                        minWidth: "16px",
                      }}
                    />
                  </Box>
                </motion.span>
              </Reorder.Item> */}
            </div>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </Box>
  );
};

export default ListFileCardDragField;

const CardImage = ({ imageURL }: { imageURL: string }) => {
  return (
    <Box
      style={{
        borderRadius: "8px",
        padding: "0px",
        width: "168px",
        height: "225px",
        maxHeight: "225px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${imageURL})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          touchAction: "none",
          pointerEvents: "none",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className=" h-[225px] rounded-8 min-w-[168px] max-h-[225px]"
      />
    </Box>
  );
};
const CardLogo = ({ imageURL }: { imageURL: string }) => {
  return (
    <Box
      style={{
        borderRadius: "8px",
        padding: "0px",
        overflow: "hidden",
      }}
      className=" relative w-[300px] h-[80px] "
    >
      <Image
        src={imageURL}
        alt="logo"
        layout="fill"
        objectFit="cover"
      />
    </Box>
  );
};
