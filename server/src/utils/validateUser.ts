import { getAuth } from "@clerk/express";
import { Request } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const validateUser = (req: Request) => {
  // In tests, bypass Clerk
  if (process.env.NODE_ENV === "test") {
    return "testUserId";
  }

  const { userId } = getAuth(req);

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  return userId;
};
