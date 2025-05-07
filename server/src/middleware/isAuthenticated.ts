import { Request, Response, NextFunction } from "express";
import { redisClient } from "../redis/client";
import { parse } from "cookie";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = parse(req.headers.cookie || "");
    const sessionId = cookies.session;

    if (!sessionId) throw new UnauthenticatedError("Missing session ID");

    const sessionData = await redisClient.get(`sessionToken-${sessionId}`);
    if (!sessionData) throw new UnauthenticatedError("Session not found");

    const { email, userId, role } = JSON.parse(sessionData);

    if (!email || !userId || !role) {
      throw new UnauthenticatedError("Invalid session data");
    }

    req.email = email;
    req.userId = userId;
    req.role = role;

    next();
  } catch (error) {
    const status = error instanceof UnauthenticatedError ? 401 : 500;
    const message = error instanceof UnauthenticatedError ? error.message : "Internal Server Error";
    res.status(status).json({ message });
  }
};
