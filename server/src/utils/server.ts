import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";

import routes from "../routes";
import { attachCorrelationId } from "../middleware/attachCorrelationId";
import { errorHandler } from "../middleware/errorHandler";
import { logRequestDetails } from "../middleware/loggerMiddleware";

function createServer() {
  const app = express();

  app.get("/favicon.ico", (_req: Request, res: Response) => {
    res.status(204).end();
  });

  app.use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL ?? "http://localhost:5173"],
    })
  );

  app.use(compression());
  app.use(cookieParser());

  app.use(attachCorrelationId);

  app.use(helmet());

  app.use(morgan("dev"));

  app.use(express.json());

  app.use(logRequestDetails);

  routes(app);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
}

export default createServer;
