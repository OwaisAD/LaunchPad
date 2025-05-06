import { redisClient } from "../redis/client";
import { logger } from "../utils/logger";
import { getSessionKey, getUserSessionKey, manageUserSessions } from "../utils/manageUserSessions";
import { validatePassword } from "../utils/validatePassword";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { getUserByEmail } from "../db/users";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client";
import { Prisma } from "../../generated/prisma";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";

async function registerUser(user: { firstName: string; lastName: string; email: string; password: string }) {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const customer = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: hashedPassword,
      },
    });

    return customer;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && (error.meta?.target as string[])?.includes("email")) {
        throw new UserAlreadyExistsError("A user with this email already exists");
      }
    }
    throw error;
  }
}

async function login(email: string, password: string, rememberMe: boolean, correlationId: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    logger.warn("Invalid credentials", { correlationId, email });
    throw new UnauthenticatedError("Invalid credentials");
  }

  await validatePassword(password, user.passwordHash);

  const sessionTokenData = await manageUserSessions(user.email, user.id, rememberMe);
  return sessionTokenData;
}

async function logout(sessionToken: string) {
  const sessionKey = getSessionKey(sessionToken);
  const sessionData = await redisClient.get(sessionKey);

  if (!sessionData) {
    throw new Error("Invalid or expired session token");
  }

  const { userId } = JSON.parse(sessionData) as {
    userId: string;
  };

  const userSessionKey = getUserSessionKey(userId);

  console.log(`Removing session token for user: ${userId}`);
  await redisClient.lRem(userSessionKey, 0, sessionToken);

  console.log(`Deleting session key: ${sessionKey}`);
  await redisClient.del(sessionKey);

  return { message: "Logged out successfully" };
}

export { registerUser, login, logout };
