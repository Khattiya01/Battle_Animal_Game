import AxiosInstance from "@/utils/interceptors";

export const patchUpdateUserJoinRoom = async (data: { id: string }) => {
  const response = await AxiosInstance.patch<any>(`/v1/room/update-user-join-room`, data);
  return response.data;
};
export const patchUpdateUserLeaveRoom = async (data: { id: string }) => {
  const response = await AxiosInstance.patch<any>(`/v1/room/update-user-leave-room`, data);
  return response.data;
};

export const fetchContact = async ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) => {
  const response = await AxiosInstance.get<any>(`/v1/room/update`);
  return response.data;
};
