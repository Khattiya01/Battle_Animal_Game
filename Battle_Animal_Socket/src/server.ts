import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pino } from 'pino';
import http from 'http';

import { env } from './common/utils/envConfig';
import rateLimiter from './common/middleware/rateLimiter';
import errorHandler from './common/middleware/errorHandler';
import { userRouter } from '@modules/user/userRouter';
import { openAPIRouter } from './api-docs/openAPIRouter';
import { authRouter } from '@modules/auth/authRouter';
import { roomRouter } from '@modules/room/roomRouter';
import { messageRouter } from '@modules/message/messageRouter';
import { Server } from 'socket.io';
import path from 'path';
import { connectSocketServer } from './socket-server/socketServer';
import { streamVideoRouter } from '@modules/stream-video/streamVideoRouter';

const logger = pino({ name: 'server start' });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(rateLimiter);

// Redis
// initializeRedisClient();

export const videoDirectory = path.join(__dirname, 'videos');

// Routes
app.use('/v1/user', userRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/room', roomRouter);
app.use('/v1/message', messageRouter);
app.use('/v1/stream-video', streamVideoRouter);

connectSocketServer();

// Swagger UI
app.use(openAPIRouter);

// test
app.use('/test', (req, res) => {
  return res.json('Hello world!');
});

// Error handlers
app.use(errorHandler());

export { server, logger, io };
