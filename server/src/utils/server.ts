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
import usersController from "../controllers/users.controller";
import { clerkMiddleware } from "@clerk/express";

function createServer() {
  const app = express();

  // app.get("/favicon.ico", (_req: Request, res: Response) => {
  //   res.status(204).end();
  // });

  app.set("trust proxy", true);

  // only use Clerk middleware in production
  if (process.env.NODE_ENV !== "test") {
    app.use(
      clerkMiddleware({
        authorizedParties: ["https://launchpad.sportia.dk", "http://localhost:3000", "https://clerk.dev"],
        proxyUrl: "https://launchpad.sportia.dk",
      })
    );
  }

  app.use(
    cors({
      credentials: true,
      origin: ["https://launchpad.sportia.dk", "http://localhost:3000", "https://clerk.dev"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );

  app.use(compression());
  app.use(cookieParser());

  app.use(attachCorrelationId);

  app.use(helmet());

  app.use(morgan("dev"));

  app.post("/users/webhook", express.raw({ type: "application/json" }), usersController.handleClerkWebhook);

  app.use(express.json());

  app.use(logRequestDetails);

  routes(app);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
}

export default createServer;
