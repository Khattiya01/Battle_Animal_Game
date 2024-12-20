import { SelectUser } from "@/db/schemas";
import { getUsers } from "@/services/users";
import { APIResponse } from "@/types/response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("pageSize") || "25";

  const responseJson: APIResponse<SelectUser[]> = {
    status: 200,
    message: "OK",
    result: {
      data: [],
      total: 0,
    },
  };

  try {
    const res = await getUsers({ page, pageSize });
    responseJson.result.data = res.data;
    responseJson.result.total = res.total;
  } catch (error) {
    console.error("Error fetching users:", error);
    responseJson.status = 500;
    responseJson.message = "Error fetching users";
  }

  return new Response(JSON.stringify(responseJson), {
    status: responseJson.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
