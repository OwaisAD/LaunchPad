import { Request, Response, NextFunction } from "express";
import { redisClient } from "../redis/client";
import { parse } from "cookie";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("We here");
    const cookies = parse(req.headers.cookie || "");
    const sessionId = cookies.session;

    console.log(cookies);
    console.log("sessionId", sessionId);

    if (!sessionId) throw new UnauthenticatedError("Missing session ID");

    const sessionData = await redisClient.get(`sessionToken-${sessionId}`);
    if (!sessionData) throw new UnauthenticatedError("Session not found");

    const { email, userId } = JSON.parse(sessionData);
    console.log(email, userId);

    if (!email || !userId) {
      throw new UnauthenticatedError("Invalid session data");
    }

    req.email = email;
    req.userId = userId;

    next();
  } catch (error) {
    const status = error instanceof UnauthenticatedError ? 401 : 500;
    const message = error instanceof UnauthenticatedError ? error.message : "Internal Server Error";
    res.status(status).json({ message });
  }
};
