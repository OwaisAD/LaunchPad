import "express";

declare module "express" {
  interface Request {
    correlationId?: string;
    user?: {
      email: string;
      userId: string;
    };
  }
}
