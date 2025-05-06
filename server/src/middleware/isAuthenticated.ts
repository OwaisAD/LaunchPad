import { Request, Response, NextFunction } from "express";
import { redisClient } from "../redis/client";
import { parse } from "cookie";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = parse(req.headers.cookie || "");
    const sessionId = cookies.session;

    if (!sessionId) {
      throw new UnauthenticatedError("Invalid session data");
    }

    const sessionData = await redisClient.get(`sessionToken-${sessionId}`);

    if (!sessionData) {
      throw new UnauthenticatedError("Invalid session data");
    }

    const parsedSessionData = JSON.parse(sessionData);

    if (!parsedSessionData.email || !parsedSessionData.userId || !parsedSessionData.role) {
      throw new UnauthenticatedError("Invalid session data");
    }

    req.email = parsedSessionData.email;
    req.userId = parsedSessionData.userId;
    req.role = parsedSessionData.role;

    next();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
