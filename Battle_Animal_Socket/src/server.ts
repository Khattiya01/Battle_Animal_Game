import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import { pino } from 'pino';
import { Server, Socket } from 'socket.io';
import http from 'http';

import { env } from '@common/utils/envConfig';
import rateLimiter from '@common/middleware/rateLimiter';
import errorHandler from '@common/middleware/errorHandler';
import { userRouter } from '@modules/user/userRouter';
import { openAPIRouter } from '@api-docs/openAPIRouter';
import { authRouter } from '@modules/auth/authRouter';
import { initializeRedisClient } from '@common/middleware/redis';
import { roomRouter } from '@modules/room/roomRouter';
import { messageRouter } from '@modules/message/messageRouter';
import axios from 'axios';
import { getMessageByRoomId } from '@common/utils/services/api.service';
import { roomService } from '@modules/room/roomService';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

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
app.use('/v1/message', messageRouter);

// sockets

const TURN_TIME_LIMIT = 20; // กำหนดเวลาต่อเทิร์น (วินาที)
const ROUND_LIMIT = 16;

// local data socket
enum statusRoom {
  Waiting,
  Starting,
  ChangingPlayerControl,
  Ended,
}
type room = {
  id: string;
  clients: client[];
  statusRoom: statusRoom;
  currentlyPlayingPlayerName: string | undefined;
  countdown: NodeJS.Timeout | undefined;
};
type client = {
  name: string;
  health: number;
  position: string;
  isReady: boolean;
};
let rooms: room[] = [];

// setup socket
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  let currentUser: client = {
    name: 'unknow',
    health: 1000,
    position: 'left',
    isReady: false,
  };

  // เก็บ roomId ใน socket
  let currentRoomId: string | undefined;

  socket.on('player-join-room', async (roomId) => {
    console.log(`${currentUser.name} recv: Player join room ${roomId}`);
    const findRoom = rooms.find((r) => r.id === roomId);

    if (findRoom && findRoom.statusRoom !== statusRoom.Waiting) return;
    currentRoomId = roomId;
    socket.join(roomId);
    console.log('rooms total', rooms);

    let room = rooms.find((r) => r.id === roomId);

    if (!room) {
      room = {
        id: roomId,
        clients: [],
        statusRoom: statusRoom.Waiting,
        currentlyPlayingPlayerName: '',
        countdown: undefined,
      }; // สร้างห้องใหม่หากไม่พบ
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
        isReady: false,
      };

      room.clients.push(currentUser);
      const roomUserCountUpdate = {
        roomId: room.id,
        newUserCount: room.clients.length,
      };
      roomService.updateUserJoinRoom(room.id);
      socket.broadcast.emit('room-user-count-updated', roomUserCountUpdate);
      roomService.updateStatusRoom(room.id, 'Waiting');
      socket.broadcast.emit('room-status-updated', roomUserCountUpdate);

      io.to(currentRoomId).emit('other-player-joined', currentUser);
      console.log('room.clients', room.clients);
      // if (room.clients.length === 2) {
      //   startTurn(currentRoomId);
      // }
    } else {
      console.log('No room found');
    }
  });

  socket.on('player-ready-room', async (data) => {
    console.log(currentUser.name + ' recv: Player ready room ' + data);
    const objectData = JSON.parse(data);
    const room = rooms.find((r) => r.id === currentRoomId);
    const client = room?.clients.find((r) => r.name === objectData.name);
    if (client) {
      client.isReady = true;
    }

    if (room && currentRoomId) {
      const allReady = room.clients.every((client) => client.isReady === true);
      if (allReady) {
        startTurn(currentRoomId);
        const roomStatusUpdate = {
          roomId: room.id,
          statusRoom: statusRoom.Starting,
        };
        socket.broadcast.emit('room-status-updated', roomStatusUpdate);
      }
    }
  });

  socket.on('player-shoot', async (data) => {
    console.log(currentUser.name + ' recv: Shoot', data);
    const objectData = JSON.parse(data);
    const room = rooms.find((r) => r.id === currentRoomId);

    if (currentRoomId && room) {
      const powerShoot = {
        name: currentUser.name,
        currentThrowForce: objectData.currentThrowForce,
        maxThrowForce: objectData.maxThrowForce,
      };
      io.to(currentRoomId).emit('player-shoot', powerShoot);
      clearInterval(room.countdown);
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

          if (client.health <= 0) {
            const manageRoom: {
              statusRoom: statusRoom;
              playerNameLoser: string;
              playerNamePlaying: string | undefined;
            } = {
              statusRoom: statusRoom.Ended,
              playerNameLoser: client.name,
              playerNamePlaying: undefined,
            };
            io.to(room.id).emit('change-status-room', manageRoom);

            const roomStatusUpdate = {
              roomId: room.id,
              statusRoom: statusRoom.Ended,
            };
            socket.broadcast.emit('room-status-updated', roomStatusUpdate);
          }
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

  socket.on('change-player-control', () => {
    console.log(currentUser.name + ' recv: change-player-control');
    const room = rooms.find((r) => r.id === currentRoomId);
    if (room && currentRoomId) {
      // room.currentlyPlayingPlayerName = getNextPlayerName(room.currentlyPlayingPlayerName, room.clients);

      // const manageRoom: {
      //   statusRoom: statusRoom;
      //   playerNameLoser: string;
      //   playerNamePlaying: string | undefined;
      // } = {
      //   statusRoom: statusRoom.ChangingPlayerControl,
      //   playerNameLoser: '',
      //   playerNamePlaying: room.currentlyPlayingPlayerName,
      // };
      // io.to(currentRoomId).emit('change-status-room', manageRoom);
      clearInterval(room.countdown);
      startTurn(currentRoomId);
    } else {
      console.log('No room found');
    }
  });

  socket.on('player-leave-room', () => {
    console.log(currentUser.name + ' recv: player-leave-room');
    const room = rooms.find((r) => r.id === currentRoomId);
    if (currentRoomId && room) {
      io.to(currentRoomId).emit('other-player-disconnected', currentUser);
      socket.leave(currentRoomId);
      for (let i = 0; i < room.clients.length; i++) {
        if (room.clients[i].name === currentUser.name) {
          roomService.updateUserLeaveRoom(room.id);
          room.clients.splice(i, 1);
        }
      }

      updateStatusRoom(room, socket);

      const roomUserCountUpdate = {
        roomId: room.id,
        newUserCount: room.clients.length,
      };
      socket.broadcast.emit('room-user-count-updated', roomUserCountUpdate);
    }
  });

  socket.on('disconnect', () => {
    console.log(currentUser.name + ' recv: disconnect');
    const room = rooms.find((r) => r.id === currentRoomId);
    if (currentRoomId && room) {
      io.to(currentRoomId).emit('other-player-disconnected', currentUser);
      socket.leave(currentRoomId);
      for (let i = 0; i < room.clients.length; i++) {
        if (room.clients[i].name === currentUser.name) {
          roomService.updateUserLeaveRoom(room.id);
          room.clients.splice(i, 1);
        }
      }

      updateStatusRoom(room, socket);
    }
  });

  socket.on('test-room', (res) => {
    console.log('test-room', res);
  });
});

function startTurn(currentRoomId: string) {
  const room = rooms.find((r) => r.id === currentRoomId);
  if (!room) return;

  // สลับตาผู้เล่น
  if (room.currentlyPlayingPlayerName) {
    room.currentlyPlayingPlayerName = getNextPlayerName(room.currentlyPlayingPlayerName, room.clients);

    // Broadcast ว่าใครเป็นคนเล่น
    const manageRoom: {
      statusRoom: statusRoom;
      playerNameLoser: string;
      playerNamePlaying: string | undefined;
    } = {
      statusRoom: statusRoom.ChangingPlayerControl,
      playerNameLoser: '',
      playerNamePlaying: room.currentlyPlayingPlayerName,
    };
    io.to(currentRoomId).emit('change-status-room', manageRoom);
  } else {
    room.currentlyPlayingPlayerName = room.clients[0].name;

    // Broadcast ว่าใครเป็นคนเล่น
    const manageRoom: {
      statusRoom: statusRoom;
      playerNameLoser: string;
      playerNamePlaying: string | undefined;
    } = {
      statusRoom: statusRoom.Starting,
      playerNameLoser: '',
      playerNamePlaying: room.clients[0].name,
    };
    io.to(currentRoomId).emit('change-status-room', manageRoom);

    roomService.updateStatusRoom(room.id, 'Starting');
  }

  // เริ่มนับเวลา
  let timeLeft = TURN_TIME_LIMIT;

  room.countdown = setInterval(() => {
    timeLeft--;

    // ส่งเวลาให้ทุกคนในห้อง
    const countdownData = {
      timeLeft: timeLeft,
    };
    io.to(currentRoomId).emit('countdown-room', countdownData);

    // ถ้าหมดเวลา เปลี่ยนตา
    if (timeLeft <= 0) {
      timeLeft = TURN_TIME_LIMIT;
      clearInterval(room.countdown);
      console.log(`Player ${room.currentlyPlayingPlayerName} ran out of time!`);
      startTurn(currentRoomId);
    }
  }, 1000);
}

function updateStatusRoom(room: room, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  if (room.clients.length < 2 && room.clients.length > 0) {
    clearInterval(room.countdown);
    room.statusRoom = statusRoom.Ended;
    room?.clients?.map((client) => {
      const manageRoom: {
        statusRoom: statusRoom;
        playerNameLoser: string;
        playerNamePlaying: string | undefined;
      } = {
        statusRoom: statusRoom.Ended,
        playerNameLoser: '',
        playerNamePlaying: undefined,
      };
      io.to(room.id).emit('change-status-room', manageRoom);

      const roomStatusUpdate = {
        roomId: room.id,
        statusRoom: statusRoom.Ended,
      };
      socket.broadcast.emit('room-status-updated', roomStatusUpdate);
      return client;
    });
  } else {
    room.statusRoom = statusRoom.Waiting;
    const roomStatusUpdate = {
      roomId: room.id,
      statusRoom: statusRoom.Waiting,
    };
    socket.broadcast.emit('room-status-updated', roomStatusUpdate);
  }
}

function getNextPlayerName(currentPlayerName: string, clients: client[]) {
  // หา index ของผู้เล่นที่กำลังเล่นอยู่ใน players
  const currentIndex = clients.findIndex((player) => player.name === currentPlayerName);

  // หา index ของผู้เล่นคนถัดไป (วนกลับไปคนแรกถ้าถึงคนสุดท้าย)
  const nextIndex = (currentIndex + 1) % clients.length;

  // คืนค่าชื่อของผู้เล่นคนถัดไป
  return clients[nextIndex].name;
}

// Swagger UI
app.use(openAPIRouter);

// test
app.use('/test', (req, res) => {
  return res.json('Hello world!');
});

// Error handlers
app.use(errorHandler());

export { server, logger };
