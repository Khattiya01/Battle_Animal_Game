import AxiosInstance from "@/utils/interceptors";

export const patchUpdateUserJoinRoom = async (data: { id: string }) => {
  const response = await AxiosInstance.patch(
    `/v1/room/update-user-join-room`,
    data
  );
  return response.data;
};
export const patchUpdateUserLeaveRoom = async (data: { id: string }) => {
  const response = await AxiosInstance.patch(
    `/v1/room/update-user-leave-room`,
    data
  );
  return response.data;
};

export const fetchContact = async () => {
  const response = await AxiosInstance.get(`/v1/room/update`);
  return response.data;
};
