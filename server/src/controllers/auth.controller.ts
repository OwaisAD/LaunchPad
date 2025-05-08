import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { loginSchema } from "../validations/loginSchema";
import { getZodErrors } from "../validations/handleZodErrors";
import { ZodError } from "zod";
import { login, logout, registerUser } from "../services/auth.service";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import { registerUserSchema } from "../validations/registerUserSchema";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";
import jwt from "jsonwebtoken";
import { manageUserSessions } from "../utils/manageUserSessions";
import { redisClient } from "../redis/client";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateTokens = (userId: string, email: string, rememberMe: boolean) => {
  const accessToken = jwt.sign({ userId, email }, ACCESS_SECRET!, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId, email }, REFRESH_SECRET!, {
    expiresIn: rememberMe ? "365d" : "30d",
  });
  return { accessToken, refreshToken };
};

async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password, rememberMe } = req.body;
    const correlationId = req.correlationId;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
    }

    loginSchema.parse({ email, password });

    // const { user, sessionToken, sessionTokenExpiry } = await login(email, password, rememberMe, correlationId!, refreshToken);
    const user = await login(email, password, rememberMe, correlationId!);

    const tokens = generateTokens(user.id, email, rememberMe);

    const { sessionToken, sessionTokenExpiry } = await manageUserSessions(
      user.email,
      user.id,
      rememberMe,
      tokens.refreshToken
    );

    console.log("Session token:", sessionToken);
    console.log("Session token expiry:", sessionTokenExpiry);

    res.cookie("accessToken", tokens.accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    const correlationId = req.correlationId;

    if (error instanceof ZodError) {
      logger.warn("Error during login", {
        correlationId,
        errorMessages: getZodErrors(error),
      });
      res.status(400).json({ errors: getZodErrors(error) });
    }

    if (error instanceof UnauthenticatedError) {
      logger.warn("Invalid credentials", {
        correlationId,
        email: req.body.email,
      });
      res.status(401).json({ message: error.message });
    }

    console.error("Unexpected error during login", error);
    logger.error("Unexpected error during login", {
      correlationId,
      error: (error as Error).message,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleRefreshToken(req: Request, res: Response) {
  const refreshToken = req.body;
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET!);
    const saved = await redisClient.get(`sessionToken-${refreshToken}`);
    if (saved != refreshToken) {
      res.status(403).json({ message: "Invalid refresh token" });
    }

    if (typeof decoded !== "string" && "userId" in decoded && "email" in decoded && "rememberMe" in decoded) {
      const newTokens = generateTokens(decoded.userId, decoded.email, decoded.rememberMe);
      const { sessionToken, sessionTokenExpiry } = await manageUserSessions(
        decoded.email,
        decoded.userId,
        decoded.rememberMe,
        newTokens.refreshToken
      );
      console.log("Session token:", sessionToken);
      console.log("Session token expiry:", sessionTokenExpiry);

      res.cookie("accessToken", newTokens.accessToken, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        refreshToken: newTokens.refreshToken,
      });
    } else {
      res.status(400).json({ message: "Invalid token payload" });
    }
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
}

async function handleRegisterUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    const errors = validateRequiredFields(req.body, ["email", "password", "firstName", "lastName", "dateOfBirth"]);

    if (errors.length > 0) {
      res.status(400).json({ errors });
    }

    registerUserSchema.parse({ email, password, firstName, lastName, dateOfBirth });

    const newUser = await registerUser({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
    });

    if (!newUser) {
      res.status(409).json({ message: "User already exists" });
    }

    res.status(201).json(newUser);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = getZodErrors(error);
      res.status(400).json({ errors: errorMessages });
    } else if (error instanceof UserAlreadyExistsError) {
      res.status(409).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleLogout(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (userId) await logout(req.cookies.accessToken);

    res.clearCookie("accessToken");
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function protectedRoute(req: Request, res: Response) {
  const token = req.cookies.accessToken;

  if (!token) res.status(401).end();

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET!);
    if (typeof decoded !== "string" && "userId" in decoded && "email" in decoded) {
      req.user = { userId: decoded.userId, email: decoded.email };
      res.json({ message: "Protected route accessed", user: req.user });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).end();
  }
}

export default {
  handleRegisterUser,
  handleRefreshToken,
  handleLogin,
  handleLogout,
  protectedRoute,
};
