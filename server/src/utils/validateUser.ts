import { getAuth } from "@clerk/express";
import { Request } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const validateUser = (req: Request) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  return userId;
};
