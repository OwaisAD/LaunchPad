declare namespace Express {
  interface Request {
    email?: string;
    userId?: string;
    correlationId: string;
  }
}
