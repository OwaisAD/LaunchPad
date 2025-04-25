import express from "express";
import routes from "../routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

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
