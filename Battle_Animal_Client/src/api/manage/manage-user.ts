import { SelectUser } from "@/db/schemas";
import { APIResponse } from "@/types/response";
import AxiosInstance from "@/utils/interceptors";

export const fetchUser = async ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) => {
  const response = await AxiosInstance.get<APIResponse<SelectUser[]>>(
    `/api/manage/user?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};
