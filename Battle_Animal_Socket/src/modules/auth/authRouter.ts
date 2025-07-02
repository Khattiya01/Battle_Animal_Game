import express, { Request, Response, Router } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { userService } from "@modules/user/userService";
import { CreateUserSchema, UserSchema } from "@modules/user/userModel";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "./../../api-docs/openAPIResponseBuilders";
import { LoginSchema } from "./authModel";
import { authService } from "./authService";
import { sendMail } from "@common/utils/sendMail";
import { defaultTempleteEmail } from "@common/utils/templates/email";

export const authRegistry = new OpenAPIRegistry();

authRegistry.register("Auth", UserSchema);

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: "post",
    path: "/v1/auth/register",
    tags: ["Auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(CreateUserSchema, "Success"),
  });

  router.post(
    "/register",
    validateRequest(CreateUserSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const serviceResponse = await userService.create(payload);
      // sendMail({
      //   title: "User management",
      //   subject: "User was registered",
      //   html: defaultTempleteEmail(),
      //   senderEmail: "khattiya.dokbua@gmail.com",
      //   senderName: "khattiya",
      //   recipientEmail: "khattiya.d.c@gmail.com",
      //   recipientName: "khattiya",
      // });
      handleServiceResponse(serviceResponse, res);
    }
  );

  authRegistry.registerPath({
    method: "post",
    path: "/v1/auth/login",
    tags: ["Auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(LoginSchema, "Success"),
  });

  router.post(
    "/login",
    validateRequest(LoginSchema),
    async (req: Request, res: Response) => {
      const serviceResponse = await authService.login(req.body);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
