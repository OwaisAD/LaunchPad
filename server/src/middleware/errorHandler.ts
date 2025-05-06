import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      errors: err.serializeErrors(),
    });
  }

  console.error("[Unhandled Error]", err);
  return res.status(500).json({
    errors: [{ message: "Something went wrong" }],
  });
};
