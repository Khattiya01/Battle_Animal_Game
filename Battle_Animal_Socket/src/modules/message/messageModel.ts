import { z } from 'zod';

export type TypeMessage = z.infer<typeof MessageSchema>;
export const MessageSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
    content: z.string(),
    roomId: z.string().uuid(),
    UserID: z.string().uuid(),
    createdBy: z.string().uuid(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable(),
  }),
});

export type TypeCreateMessage = z.infer<typeof CreateMessage>;
export const CreateMessage = z.object({
  body: z.object({
    roomId: z.string().uuid(),
    content: z.string(),
  }),
});

export type TypeGetMessageByRoomId = z.infer<typeof MessageByRoomIdSchema>;
export const MessageByRoomIdSchema = z.object({
  params: z.object({
    roomId: z.string().uuid(),
  }),
});
