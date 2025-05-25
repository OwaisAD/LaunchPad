import { Request, Response, NextFunction } from "express";

export function mockRequireAuth(req: Request, _res: Response, next: NextFunction): void {
  // Mock user object to simulate an authenticated user for testing purposes
  req.user = {
    userId: "testUserId",
    email: "test@example.com",
  };
  next();
}
