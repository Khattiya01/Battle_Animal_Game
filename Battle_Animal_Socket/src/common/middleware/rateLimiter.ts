import { Request } from "express";
import { rateLimit } from "express-rate-limit";

import { env } from "@common/utils/envConfig";
import { logger } from "@src/server";

const rateLimiter = rateLimit({
    legacyHeaders: true,
    limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS ?? 20,
    // message: 'Too many requests, please try again later.',
    message: `You have exceeded the ${env.COMMON_RATE_LIMIT_MAX_REQUESTS} requests limit!, please try again later.`,
    standardHeaders: true,
    windowMs: 15 * 60 * (env.COMMON_RATE_LIMIT_WINDOW_MS ?? 1000),
    keyGenerator,
  });

function keyGenerator(request: Request): string {
  if (!request.ip) {
    logger.error("Warning: request.ip is missing!");
    return request.socket.remoteAddress as string;
  }

  return request.ip.replace(/:\d+[^:]*$/, "");
}

export default rateLimiter;

// import { RateLimiterRedis } from "rate-limiter-flexible";
// import moment from "moment";
// import { createClient } from "redis";
// import { promisify } from "util";
// let redisURL = process.env.REDIS_URI;

// const redisClient = createClient({ url: redisURL });

// const getAsync = promisify(redisClient?.get).bind(redisClient);
// const setAsync = promisify(redisClient?.set).bind(redisClient);
// const WINDOW_SIZE_IN_HOURS = 24;
// const MAX_WINDOW_REQUEST_COUNT = 10;
// const WINDOW_LOG_INTERVAL_IN_HOURS = 1;
// const opts = {
//   storeClient: redisClient,
//   keyPrefix: "rateLimiter",
//   points: MAX_WINDOW_REQUEST_COUNT,
//   duration: WINDOW_SIZE_IN_HOURS * 60 * 60,
//   blockDuration: WINDOW_SIZE_IN_HOURS * 60 * 60,
// };
// const rateLimiter = new RateLimiterRedis(opts);
// export const rateLimiterUsingThirdParty = async (req, res, next) => {
//   try {
//     await rateLimiter.consume(req.ip);
//     return next();
//   } catch (error) {
//     return res
//       .status(429)
//       .jsend?.error(
//         `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
//       );
//   }
// };
// export const customRedisRateLimiter = async (req, res, next) => {
//   try {
//     const currentRequestTime = moment();
//     // fetch records of the current user using IP address
//     const record = await getAsync(req.ip);
//     // if no record is found, create a new record for the user and store it in Redis
//     if (record == null) {
//       const newRecord = [
//         {
//           requestTimeStamp: currentRequestTime.unix(),
//           requestCount: 1,
//         },
//       ];
//       await setAsync(req.ip, JSON.stringify(newRecord));
//       return next();
//     }
//     // if a record is found, parse its value and calculate the number of requests the user has made within the last window
//     const data = JSON.parse(record);
//     const windowStartTimestamp = moment()
//       .subtract(WINDOW_SIZE_IN_HOURS, "hours")
//       .unix();
//     const requestsWithinWindow = data.filter(
//       (entry) => entry.requestTimeStamp > windowStartTimestamp
//     );
//     const totalWindowRequestsCount = requestsWithinWindow.reduce(
//       (accumulator, entry) => accumulator + entry.requestCount,
//       0
//     );
//     // if the number of requests made is greater than or equal to the desired maximum, return an error
//     if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
//       return res
//         .status(429)
//         .jsend.error(
//           `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
//         );
//     }
//     // if the number of requests made is less than the allowed maximum, log a new entry
//     const lastRequestLog = data[data.length - 1];
//     const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
//       .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
//       .unix();
//     // if the interval has not passed since the last request log, increment the counter
//     if (
//       lastRequestLog.requestTimeStamp >
//       potentialCurrentWindowIntervalStartTimeStamp
//     ) {
//       lastRequestLog.requestCount++;
//       data[data.length - 1] = lastRequestLog;
//     } else {
//       // if the interval has passed, log a new entry for the current user and timestamp
//       data.push({
//         requestTimeStamp: currentRequestTime.unix(),
//         requestCount: 1,
//       });
//     }
//     await setAsync(req.ip, JSON.stringify(data));
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// };
