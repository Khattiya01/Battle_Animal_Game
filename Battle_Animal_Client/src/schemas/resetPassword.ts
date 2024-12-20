import { resetPasswordType } from "@/types/requests/resetPassword";
import { z, ZodType } from "zod";

export const resetPasswordSchema: ZodType<resetPasswordType> = z.object({
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
  confirmPassword: z.string().min(1, "กรุณากรอกยืนยันรหัสผ่าน"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
}) as ZodType<resetPasswordType>;
