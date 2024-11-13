import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@common/utils/httpHandlers';
import { userService } from '@modules/user/userService';

import { GetUserSchema, UpdateUserSchema, UserSchema } from './userModel';
import authenticateToken from '@common/middleware/authenticateToken';
import { redisCachingMiddleware } from '@common/middleware/redis';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  const bearerAuth = userRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/v1/user/get',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get('/get', redisCachingMiddleware({ EX: 10 }), async (req: Request, res: Response) => {
    const query = req.query;
    const page: number = parseInt((query.Page as string) ?? 1);
    const size: number = parseInt((query.Size as string) ?? 10);
    const serviceResponse = await userService.findAll({ page, size });
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/v1/user/get/{UserID}',
    tags: ['User'],
    // security: [{ [bearerAuth.name]: [] }],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get(
    '/get/:UserID',
    // authenticateToken,
    redisCachingMiddleware({ EX: 10 }),
    validateRequest(GetUserSchema),
    async (req: Request | any, res: Response) => {
      const { UserID } = req.params;
      const serviceResponse = await userService.findById(UserID);
      handleServiceResponse(serviceResponse, res);
    }
  );

  userRegistry.registerPath({
    method: 'patch',
    path: '/v1/user/update',
    tags: ['User'],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UpdateUserSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(UpdateUserSchema, 'Success'),
  });

  router.patch('/update', authenticateToken, validateRequest(UpdateUserSchema), async (req: Request, res: Response) => {
    const { UserID } = req.body;
    const payload = req.body;
    const serviceResponse = await userService.update(UserID, payload);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'delete',
    path: '/v1/user/delete/{UserID}',
    tags: ['User'],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: GetUserSchema.shape.params,
    },
    responses: createApiResponse(GetUserSchema, 'Success'),
  });

  router.delete(
    '/delete/:UserID',
    authenticateToken,
    validateRequest(GetUserSchema),
    async (req: Request, res: Response) => {
      const { UserID } = req.params;
      const serviceResponse = await userService.delete(UserID);
      handleServiceResponse(serviceResponse, res);
    }
  );
  return router;
})();
