import { loginType } from "@/types/requests/auth";
import { z, ZodType } from "zod";

export const loginSchema: ZodType<loginType> = z.object({
  username: z.string().min(1, { message: "กรุณากรอกชื่อผู้ใช้" }),
  password: z.string().min(1, "กรุณากรอกชื่อรหัสผ่าน"),
}) as ZodType<loginType>;
