import { Selectgame } from "@/db/schemas/games";
import { APIResponse } from "@/types/response";
import AxiosInstance from "@/utils/interceptors";

export const fetchGame = async ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) => {
  const response = await AxiosInstance.get<APIResponse<Selectgame[]>>(
    `/api/manage/game?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};
