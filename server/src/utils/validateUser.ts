import { getAuth } from "@clerk/express";
import { Request } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const validateUser = (req: Request) => {
  const { userId } = getAuth(req);

  console.log("User ID from Clerk:", userId);

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  return userId;
};
