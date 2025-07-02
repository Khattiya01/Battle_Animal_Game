import { editPasswordUser } from "@/services/users";
import { APIResponse } from "@/types/response";
import { hashPassword } from "@/utils/hashPassword";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const userId = formData.get("userId")?.toString();
  const responseJson: APIResponse<[]> = {
    status: 200,
    message: "OK",
    result: {
      data: [],
      total: 0,
    },
  };

  try {
    // const token = request.headers.get("Authorization")?.split(" ")[1];
    // if (password && token) {
    //   const jwtPayload = verify(token, process.env.JWT_SECRET ?? "") as {
    //     userId: string;
    //     iat: number;
    //     type: string;
    //   };
    //   const userId = jwtPayload.userId;
    //   const hashedPassword = await hashPassword(password);
    //   await editPasswordUser({ password: hashedPassword, id: userId })
    //     .then(() => {})
    //     .catch((err) => {
    //       responseJson.status = 400;
    //       responseJson.message = err.message;
    //     });
    // } else {
    //   responseJson.status = 400;
    //   responseJson.message = "password is not specified";
    // }
    if (password && userId) {
      const hashedPassword = await hashPassword(password);
      await editPasswordUser({ password: hashedPassword, id: userId })
        .then(() => {})
        .catch((err) => {
          responseJson.status = 400;
          responseJson.message = err.message;
        });
    }
  } catch {
    responseJson.status = 400;
    responseJson.message = "Error post email";
  }

  return new Response(JSON.stringify(responseJson), {
    status: responseJson.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
