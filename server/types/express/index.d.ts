declare namespace Express {
  interface Request {
    correlationId: string;
    user: {
      email?: string;
      userId: string;
    };
  }
}
