"use client";

import { useState } from "react";
import DialogDelete from "@/components/dialogs/dialogDelete";
import useToastStore, { typeStatusTaost } from "@/hooks/useToastStore";
import { BoxLoadingData } from "@/components/boxLoading/BoxLoadingData";
import { Box, Text } from "@radix-ui/themes";
import ButtonDefault from "@/components/buttons/buttonDefault";
import { IoMdAdd } from "react-icons/io";
import BoxNotDataTableAdmin from "@/components/boxNotData/boxNotDataTableAdmin";
import { updateIsActiveUserAction } from "@/actions/users";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useSearchParams } from "next/navigation";
import { TableGame } from "../tables/tableGame";
import { useGame } from "@/hooks/useGame";
import { Selectgame } from "@/db/schemas";
import DialogAddGame from "../dialogs/dialogAddGame";
import { deleteGameAction } from "@/actions/games";

export function ManageGame() {
  // states
  const [openDialogCreateGame, setOpenDialogCreateGame] =
    useState<boolean>(false);
  const [activeData, setActiveData] = useState<Selectgame | undefined>(
    undefined
  );
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  // pagination
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  // hooks
  const {
    data: dataGame,
    refetch: refetchGame,
    isLoading,
  } = useGame({ page, pageSize });
  const showToast = useToastStore((state) => state.show);

  // functions

  const onSuccessDailogGame = () => {
    refetchGame();
    setOpenDialogCreateGame(false);
    setActiveData(undefined);
  };

  const onCancelDailogGame = () => {
    setOpenDialogCreateGame(false);
    setActiveData(undefined);
  };

  const handleOpenDailogCreate = () => {
    setOpenDialogCreateGame(true);
  };

  const handleOpenDailogEdit = (data: Selectgame) => {
    setActiveData(data);
    setOpenDialogCreateGame(true);
  };

  const handleSubmitDelete = async () => {
    if (activeData) {
      handleCloseDialogDelete();
      setActiveData(undefined);
      await deleteGameAction({
        id: activeData.id,
      })
        .then((res) => {
          if (res?.success) {
            refetchGame();
            showToast("ลบเกมส์สำเร็จ", "", new Date(), typeStatusTaost.success);
          } else {
            console.error("Error delete delete user:", res?.message);
            showToast(
              "ลบเกมส์ไม่สำเร็จ",
              "",
              new Date(),
              typeStatusTaost.error
            );
          }
        })
        .catch((err) => {
          console.error("Error delete delete user:", err.message);
        });
    } else {
      console.log("error deleting: active user Data is undefined");
    }
  };
  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
    setActiveData(undefined);
  };
  const handleOpenDialogDelete = (data: Selectgame) => {
    setActiveData(data);
    setOpenDialogDelete(true);
  };

  const handleClickIsActive = async (isActive: boolean, id: string) => {
    const formData = new FormData();
    formData.append("is_active", isActive ? "true" : "false");
    await updateIsActiveUserAction({ formData, id })
      .then(() => {
        refetchGame();
      })
      .catch((err) => {
        console.error("Error create user:", err?.message);
      });
  };
  // lifecycle

  return (
    <>
      <Box style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <ButtonDefault onClick={handleOpenDailogCreate}>
          <IoMdAdd size={"20px"} />
          <Text>เพิ่ม เกมส์</Text>
        </ButtonDefault>
      </Box>

      <Box
        style={{
          borderRadius: "8px",
          padding: "24px",
          gap: "16px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {!isLoading ? (
          <>
            <TableGame
              rows={dataGame?.result.data}
              handleClickEdit={handleOpenDailogEdit}
              handleOpenDialogDelete={handleOpenDialogDelete}
              handleClickIsActive={handleClickIsActive}
            />

            {dataGame?.result.data && dataGame?.result.data?.length <= 0 ? (
              <BoxNotDataTableAdmin />
            ) : (
              <PaginationWithLinks
                page={parseInt(page)}
                pageSize={parseInt(pageSize)}
                totalCount={dataGame?.result.total ?? 0}
                pageSizeSelectOptions={{
                  pageSizeOptions: [15, 25, 35, 50],
                }}
              />
            )}
          </>
        ) : (
          <BoxLoadingData height="300px" />
        )}

        <DialogAddGame
          dialogType={activeData ? "edit" : "create"}
          data={activeData}
          onSuccess={onSuccessDailogGame}
          onCancel={onCancelDailogGame}
          isOpen={openDialogCreateGame}
        />

        <DialogDelete
          handleClose={handleCloseDialogDelete}
          handleSubmit={handleSubmitDelete}
          openModalDelete={openDialogDelete}
        />
      </Box>
    </>
  );
}
