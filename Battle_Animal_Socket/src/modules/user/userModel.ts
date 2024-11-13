import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@common/utils/commonValidation";

extendZodWithOpenApi(z);

export type TypeUser = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  UserID: z.string().uuid(),
  Username: z.string().optional(),
  Email: z.string().email().optional(),
  Password: z.string().optional(),
  FirstName: z.string().default("member"),
  LastName: z.string().optional(),
  Tel: z.string().max(20).optional(),
  Role: z.number().int(),
  CreatedAt: z.date().default(() => new Date()),
  UpdatedAt: z.date().nullable(),
});

// Input Validation for 'GET users/:UserID' endpoint
export const GetUserSchema = z.object({
  params: z.object({ UserID: commonValidations.uuid }),
});

export type TypeUpdateUser = z.infer<typeof UpdateUserSchema>;
export const UpdateUserSchema = z.object({
  body: z.object({
    UserID: z.string().uuid(),
    Email: z.string().email().optional(),
    Password: z.string().optional(),
    FirstName: z.string().optional(),
    LastName: z.string().optional(),
    Tel: z.string().max(20).optional(),
  }),
});

export type TypeCreateUser = z.infer<typeof CreateUserSchema>;
export type TypePayloadUser = {
  Email: string;
  Username: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Tel: string;
};
export const CreateUserSchema = z.object({
  body: z.object({
    Email: z.string().email(),
    Username: z.string(),
    Password: z.string(),
    FirstName: z.string(),
    LastName: z.string(),
    Tel: z.string().max(20).optional(),
  }),
});
