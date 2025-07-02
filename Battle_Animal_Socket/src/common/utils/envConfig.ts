import dotenv from 'dotenv';
// import { cleanEnv, host, num, port, str } from "envalid";

dotenv.config();

export const env = {
  NODE_ENV: "production",
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || '8081',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  COMMON_RATE_LIMIT_MAX_REQUESTS: process.env.COMMON_RATE_LIMIT_MAX_REQUESTS || 1000,
  COMMON_RATE_LIMIT_WINDOW_MS: process.env.COMMON_RATE_LIMIT_WINDOW_MS || 60,
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET2024',
  ACCESS_EXPIRATION_MINUTES: process.env.ACCESS_EXPIRATION_MINUTES || 10000,
  REFRESH_EXPIRATION_DAYS: process.env.REFRESH_EXPIRATION_DAYS || 1,
  REDIS_URI: process.env.REDIS_URI || '',
  TOKEN_MAILTRAP: process.env.TOKEN_MAILTRAP || '',
};

// export const env = cleanEnv(process.env, {
//   NODE_ENV: str({ choices: ["development", "test", "production"] }),
//   HOST: host(),
//   PORT: port(),
//   CORS_ORIGIN: str(),
//   COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
//   COMMON_RATE_LIMIT_WINDOW_MS: num(),
//   JWT_SECRET: str(),
//   ACCESS_EXPIRATION_MINUTES: num(),
//   REFRESH_EXPIRATION_DAYS: num(),
//   REDIS_URI: str(),
//   TOKEN_MAILTRAP: str(),
// });
