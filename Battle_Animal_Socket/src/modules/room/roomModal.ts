import { MessageSchema } from '@modules/message/messageModel';
import { z } from 'zod';

const RoomStatusEnum = z.enum(["ACTIVE", "FULL", "CLOSED", "IN_GAME"]);

export type TypeRoom = z.infer<typeof RoomSchema>;
export const RoomSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
    roomeName: z.string(),
    messages: MessageSchema,
    status: RoomStatusEnum,
    maxUsers: z.number().min(1), // กำหนดค่าอย่างน้อยต้องเป็น 1
    currentUsers: z.number().min(0), // ต้องไม่ติดลบ
    isPrivate: z.boolean(),
    createdBy: z.string().uuid(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable(),
  }),
});

export type TypeCreateRoom = z.infer<typeof CreateRoomSchema>;
export const CreateRoomSchema = z.object({
  body: z.object({
    roomName: z.string().min(1, "Room name is required"),
  }),
});

export type TypeUpdateRoom = z.infer<typeof UpdateRoomSchema>;
export const UpdateRoomSchema = z.object({
  body: z.object({
    roomName: z.string().optional(), // อนุญาตให้เว้นได้ (ไม่อัปเดต)
    status: z.enum(["ACTIVE", "FULL", "CLOSED", "IN_GAME"]).optional(), // สถานะของห้อง
    isPrivate: z.boolean().optional(), // ตั้งค่าความเป็น private
    currentUsers: z.number().min(1).optional(), // จำนวนผู้เล่นสูงสุดในห้อง
    maxUsers: z.number().min(1).optional(), // จำนวนผู้เล่นสูงสุดในห้อง
  }),
});

export type TypeUpdateRoomCountPlayer = z.infer<typeof UpdateRoomCountPlayerSchema>;
export const UpdateRoomCountPlayerSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
  }),
});


export const GetRoomParamsSchema = z.object({
  params: z.object({ page: z.string(), size: z.string() }),
});

export type TypeGetRoomById = z.infer<typeof RoomByIdSchema>;
export const RoomByIdSchema = z.object({
  params: z.object({
    roomId: z.string().uuid(),
  }),
});
