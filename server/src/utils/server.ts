import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import routes from "../routes";

function createServer() {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL ?? "http://localhost:5173"],
    })
  );

  app.use(compression());
  app.use(cookieParser());

  app.use(helmet());

  app.use(morgan("dev"));

  app.use(express.json());

  routes(app);

  return app;
}

export default createServer;
