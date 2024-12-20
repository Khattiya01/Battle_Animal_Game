import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import 'dotenv/config';

export const env = createEnv({
  skipValidation: true,
  server: {
    POSTGRES_URL: z.string().min(1),

  },
  client: {},
  runtimeEnv: {
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
});
