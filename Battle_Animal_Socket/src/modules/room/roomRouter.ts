import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from './../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@common/utils/httpHandlers';

import authenticateToken from '@common/middleware/authenticateToken';
import { redisCachingMiddleware } from '@common/middleware/redis';
import { CreateRoomSchema, GetRoomParamsSchema, RoomSchema, UpdateRoomCountPlayerSchema, UpdateRoomSchema } from './roomModal';
import { roomService } from './roomService';
import { MessageByRoomIdSchema } from '@modules/message/messageModel';
import { io } from '@src/server';

export const roomRegistry = new OpenAPIRegistry();

roomRegistry.register('Room', RoomSchema);

export const roomRouter: Router = (() => {
  const router = express.Router();

  const bearerAuth = roomRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  roomRegistry.registerPath({
    method: 'get',
    path: '/v1/room/get?page={page}&size={size}',
    tags: ['Room'],
    request: { params: GetRoomParamsSchema.shape.params },
    responses: createApiResponse(z.array(RoomSchema.shape.body), 'Success'),
  });

  router.get(
    '/get',
    // authenticateToken,
    // validateRequest(GetRoomParamsSchema),
    // redisCachingMiddleware({ EX: 10 }),
    async (req: Request, res: Response) => {
      const query = req.query;
      const page: number = parseInt((query.page as string) ?? 1);
      const size: number = parseInt((query.size as string) ?? 10);
      const serviceResponse = await roomService.findAll({ page, size });
      handleServiceResponse(serviceResponse, res);
    }
  );

  roomRegistry.registerPath({
    method: 'get',
    path: '/v1/room/get/{roomId}',
    tags: ['Room'],
    // security: [{ [bearerAuth.name]: [] }],
    request: { params: MessageByRoomIdSchema.shape.params },
    responses: createApiResponse(RoomSchema.shape.body, 'Success'),
  });

  router.get(
    '/get/:roomId',
    // authenticateToken,
    // redisCachingMiddleware({ EX: 10 }),
    validateRequest(MessageByRoomIdSchema),
    async (req: Request | any, res: Response) => {
      const { roomId } = req.params;
      const serviceResponse = await roomService.findById(roomId);
      handleServiceResponse(serviceResponse, res);
    }
  );

  roomRegistry.registerPath({
    method: 'post',
    path: '/v1/room/create',
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Room'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateRoomSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(RoomSchema, 'Success'),
  });

  router.post(
    '/create',
    authenticateToken,
    validateRequest(CreateRoomSchema),
    async (req: Request | any, res: Response) => {
      const token = req.token;
      const serviceResponse = await roomService.create(token.payload.userId, req);
      if (serviceResponse.success) {
        handleServiceResponse(serviceResponse, res);
        io.emit('room-added', serviceResponse.responseObject);
      }
    }
  );

  roomRegistry.registerPath({
    method: 'patch',
    path: '/v1/room/update-user-join-room',
    tags: ['Room'],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UpdateRoomCountPlayerSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(RoomSchema, 'Success'),
  });

  router.patch('/update-user-join-room', authenticateToken, validateRequest(UpdateRoomCountPlayerSchema), async (req: Request, res: Response) => {
    const { id } = req.body;
    const serviceResponse = await roomService.updateUserJoinRoom(id);
    handleServiceResponse(serviceResponse, res);
  });

  roomRegistry.registerPath({
    method: 'patch',
    path: '/v1/room/update-user-leave-room',
    tags: ['Room'],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UpdateRoomCountPlayerSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(RoomSchema, 'Success'),
  });

  router.patch('/update-user-leave-room', authenticateToken, validateRequest(UpdateRoomCountPlayerSchema), async (req: Request, res: Response) => {
    const { id } = req.body;
    const serviceResponse = await roomService.updateUserLeaveRoom(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
