import {
  ResponseStatus,
  ServiceResponse,
} from "./../../common/models/serviceResponse";
import { env } from "./../../common/utils/envConfig";
import { handleServiceResponse } from "./../../common/utils/httpHandlers";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";

function authenticateToken(req: any, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  console.log("req", req.header);
  let jwtPayload;
  if (!token) {
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        "Authentication failed",
        null,
        StatusCodes.UNAUTHORIZED
      ),
      res
    );
  }
  try {
    jwtPayload = <any>verify(token?.split(" ")[1], env.JWT_SECRET, {
      complete: true,
      algorithms: ["HS256"],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    });
    req.token = jwtPayload;
  } catch (error) {
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        "Token is not valid",
        null,
        StatusCodes.FORBIDDEN
      ),
      res
    );
  }
  next();
}

export default authenticateToken;
