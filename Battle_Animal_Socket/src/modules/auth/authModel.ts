import { z } from 'zod';


export type TypeLoginSchema = z.infer<typeof LoginSchema>;
export type TypePayloadLogin = {
  Email?: string;
  Username: string;
  Password: string;
};
export const LoginSchema = z.object({
  body: z.object({
    Email: z.string().email().optional(),
    Username: z.string(),
    Password: z.string(),
  }),
});
