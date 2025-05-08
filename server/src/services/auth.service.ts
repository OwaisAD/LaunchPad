import { redisClient } from "../redis/client";
import { logger } from "../utils/logger";
import { getSessionKey, getUserSessionKey } from "../utils/manageUserSessions";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { getUserByEmail } from "../db/users";
import prisma from "../../prisma/client";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function registerUser(user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}) {
  try {
    // const hashedPassword = await bcrypt.hash(user.password, 10);

    const customer = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    return customer;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
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

  // await validatePassword(password, user.passwordHash);

  return user;
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
