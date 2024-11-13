import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pino } from 'pino';
import { Server } from 'socket.io';
import http from 'http';

import { env } from '@common/utils/envConfig';
import rateLimiter from '@common/middleware/rateLimiter';
import errorHandler from '@common/middleware/errorHandler';
import { userRouter } from '@modules/user/userRouter';
import { openAPIRouter } from '@api-docs/openAPIRouter';
import { authRouter } from '@modules/auth/authRouter';
import { initializeRedisClient } from '@common/middleware/redis';
import { roomRouter } from '@modules/room/roomRouter';
import axios from 'axios';
import { getMessageByRoomId } from '@common/utils/services/api.service';
import { roomService } from '@modules/room/roomService';

const logger = pino({ name: 'server start' });
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Redis
// initializeRedisClient();

// Routes
app.use('/v1/user', userRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/room', roomRouter);

// sockets

// local data socket
type room = {
  id: string;
  clients: client[];
};
type client = {
  name: string;
  health: number;
  position: string;
};
let rooms: room[] = [];

// setup socket
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  let currentUser: client = {
    name: 'unknow',
    health: 1000,
    position: 'left',
  };

  // เก็บ roomId ใน socket
  let currentRoomId: string | undefined;

  socket.on('player-join-room', async (roomId) => {
    console.log(`${currentUser.name} recv: Player join room ${roomId}`);
    currentRoomId = roomId;
    socket.join(roomId);
    console.log('rooms total', rooms);

    let room = rooms.find((r) => r.id === roomId);

    if (!room) {
      room = { id: roomId, clients: [] }; // สร้างห้องใหม่หากไม่พบ
      rooms.push(room);
    }

    if (room.clients.length > 0) {
      room.clients.forEach((client) => {
        socket.emit('other-player-joined', client);
      });
    }

    // สร้างอ็อบเจกต์ข้อมูลเกี่ยวกับผู้เล่นในห้อง
    const response = {
      playerCount: room.clients.length,
      clients: JSON.stringify(room.clients),
    };

    socket.emit('player-join-room', response);
  });

  socket.on('player-play', async (data) => {
    // const serviceResponse = await roomService.updateUserJoinRoom(roomId);
    console.log(currentUser.name + ' recv: Play' + data);
    const objectData = JSON.parse(data);
    const room = rooms.find((r) => r.id === currentRoomId);

    if (room && currentRoomId) {
      currentUser = {
        name: objectData.name,
        health: 1000,
        position: objectData.position,
      };

      room.clients.push(currentUser);
      const roomUserCountUpdate = {
        roomId: room.id,
        newUserCount: room.clients.length,
      };
      roomService.updateUserJoinRoom(room.id);
      socket.broadcast.emit('room-user-count-updated', roomUserCountUpdate);
      console.log('room' + room.id);
      console.log('currentRoomId' + currentRoomId);
      console.log('currentUser.name' + currentUser.name);
      io.to(currentRoomId).emit('other-player-joined', currentUser);
    } else {
      console.log('No room found');
    }
  });

  socket.on('player-shoot', async (data) => {
    console.log(currentUser.name + ' recv: Shoot', data);
    const objectData = JSON.parse(data);

    if (currentRoomId) {
      const powerShoot = {
        name: currentUser.name,
        currentThrowForce: objectData.currentThrowForce,
        maxThrowForce: objectData.maxThrowForce,
      };
      io.to(currentRoomId).emit('player-shoot', powerShoot);
    } else {
      console.log('No room found');
    }
  }); 

  socket.on('player-power-scale', async (data) => {
    console.log(currentUser.name + ' recv: player-power-scale' + data);
    const objectData = JSON.parse(data);
    if (currentRoomId) {
      const data = {
        name: currentUser.name,
      };
      // socket.emit('player-shoot', data);
      // io.to(currentRoomId).emit('player-shoot', data);
    } else {
      console.log('No room found');
    }
  });

  socket.on('player-Decrease-health', async (data) => {
    console.log(currentUser.name + ' recv: health', JSON.stringify(data));
    const objectData: {
      fromName: string;
      targetName: string;
      totalDamage: number;
      type: string;
      criticalStrike: boolean;
    } = JSON.parse(data);

    const room = rooms.find((r) => r.id === currentRoomId);
    console.log('data.fromName', objectData.fromName);
    console.log('currentUser.name', currentUser.name);
    console.log('currentRoomId', currentRoomId);
    if (objectData.fromName === currentUser.name && currentRoomId) {
      let indexDamage = 0;
      room?.clients?.map((client, index) => {
        if (client.name === objectData.targetName) {
          indexDamage = index;
          client.health -= objectData.totalDamage;
        }
        return client;
      });

      const response = {
        formName: objectData.fromName,
        targetName: objectData.targetName,
        totalDamage: objectData.totalDamage,
        type: objectData.type,
        criticalStrike: objectData.criticalStrike,
        // targetName: room?.clients[indexDamage].name,
        // health: room?.clients[indexDamage].health,
      };
      console.log(currentUser.name + ' bcst: health' + JSON.stringify(response));

      io.to(currentRoomId).emit('player-Decrease-health', response);
    }
  });

  socket.on('player-leave-room', () => {
    console.log(currentUser.name + ' recv: player-leave-room');
    const room = rooms.find((r) => r.id === currentRoomId);
    if (currentRoomId && room) {
      io.to(currentRoomId).emit('other-player-disconnected', currentUser);
      socket.leave(currentRoomId);
      console.log(currentUser.name + ' bcst: other player disconnect' + JSON.stringify(currentUser));
      console.log('room', room);
      for (let i = 0; i < room.clients.length; i++) {
        if (room.clients[i].name === currentUser.name) {
          roomService.updateUserLeaveRoom(room.id);
          room.clients.splice(i, 1);
        }
      }
      const roomUserCountUpdate = {
        roomId: room.id,
        newUserCount: room.clients.length,
      };
      socket.broadcast.emit('room-user-count-updated', roomUserCountUpdate);
      console.log('room', room);
    }
  });

  socket.on('disconnect', () => {
    console.log(currentUser.name + ' recv: disconnect');
    const room = rooms.find((r) => r.id === currentRoomId);
    if (currentRoomId && room) {
      io.to(currentRoomId).emit('other-player-disconnected', currentUser);
      socket.leave(currentRoomId);
      console.log(currentUser.name + ' bcst: other player disconnect' + JSON.stringify(currentUser));
      for (let i = 0; i < room.clients.length; i++) {
        if (room.clients[i].name === currentUser.name) {
          roomService.updateUserLeaveRoom(room.id);
          room.clients.splice(i, 1);
        }
      }
    }
  });

  socket.on('test-room', (res) => {
    console.log('test-room', res);
  });
});

// Swagger UI
app.use(openAPIRouter);

// test
app.use('/test', (req, res) => {
  return res.json('Hello world!');
});

// Error handlers
app.use(errorHandler());

export { server, logger };
