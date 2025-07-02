import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from './../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@common/utils/httpHandlers';

import authenticateToken from '@common/middleware/authenticateToken';
import { redisCachingMiddleware } from '@common/middleware/redis';
import { CreateMessage, MessageByRoomIdSchema, MessageSchema } from './messageModel';
import { messageService } from './messageService';

export const messageRegistry = new OpenAPIRegistry();

messageRegistry.register('Message', MessageSchema);

export const messageRouter: Router = (() => {
  const router = express.Router();

  const bearerAuth = messageRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  messageRegistry.registerPath({
    method: 'get',
    path: '/v1/message/get',
    tags: ['Message'],
    responses: createApiResponse(z.array(MessageSchema), 'Success'),
  });

  router.get('/get', redisCachingMiddleware({ EX: 10 }), async (req: Request, res: Response) => {
    const query = req.query;
    const page: number = parseInt((query.Page as string) ?? 1);
    const size: number = parseInt((query.Size as string) ?? 10);
    const serviceResponse = await messageService.findAll({ page, size });
    handleServiceResponse(serviceResponse, res);
  });

  // messageRegistry.registerPath({
  //   method: 'get',
  //   path: '/v1/message/get/{roomId}',
  //   tags: ['Room'],
  //   // security: [{ [bearerAuth.name]: [] }],
  //   request: { params: MessageByRoomIdSchema.shape.params },
  //   responses: createApiResponse(MessageSchema, 'Success'),
  // });

  // router.get(
  //   '/get/:UserID',
  //   // authenticateToken,
  //   redisCachingMiddleware({ EX: 10 }),
  //   validateRequest(MessageByRoomIdSchema),
  //   async (req: Request | any, res: Response) => {
  //     const { roomId } = req.params;
  //     const serviceResponse = await messageService.findById(roomId);
  //     handleServiceResponse(serviceResponse, res);
  //   }
  // );

  messageRegistry.registerPath({
    method: 'post',
    path: '/v1/message/create',
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Message'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateMessage.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(MessageSchema, 'Success'),
  });

  router.post(
    '/create',
    authenticateToken,
    validateRequest(CreateMessage),
    async (req: Request | any, res: Response) => {
      const token = req.token;
      console.log(`Create message`, token.payload.userId)
      const serviceResponse = await messageService.create(token.payload.userId, req);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
