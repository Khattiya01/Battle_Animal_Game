import { APIResponse } from "@/types/response";
import axios from "axios";

export const postResetPassword = async (data: {
  password: string;
  userId: string;
}) => {
  const fd = new FormData();
  fd.append("password", data.password);
  fd.append("userId", data.userId);

  const response = await axios.post<APIResponse<[]>>(`/api/reset-password`, fd);
  return response.data;
};
