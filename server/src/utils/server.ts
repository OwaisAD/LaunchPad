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
import { register, Counter, Histogram, Gauge } from "prom-client";
import os from 'os';

function createServer() {
  const app = express();

  // app.get("/favicon.ico", (_req: Request, res: Response) => {
  //   res.status(204).end();
  // });

  app.set("trust proxy", true);

  // REGISTER METRICS
  const requestCount = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
  });

  const requestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.5, 1, 1.5, 2, 3, 5],
  });

  new Gauge({
    name: "process_cpu_usage_percent",
    help: "CPU usage of the Node.js process as a percentage",
    collect() {
      const usage = process.cpuUsage();
      const elapsedTime = process.uptime(); // Total elapsed time in seconds
      const userTime = usage.user / 1e6; // Convert from microseconds to seconds
      const systemTime = usage.system / 1e6;

      const totalCpuTime = (userTime + systemTime) / elapsedTime; // Total CPU time per second
      const numCores = os.cpus().length; // Number of CPU cores
      const cpuPercentage = (totalCpuTime / numCores) * 100; // Percentage relative to total cores

      this.set(cpuPercentage); // Set gauge value
    },
  });

  new Gauge({
    name: "process_memory_usage_bytes",
    help: "Memory usage of the Node.js process in bytes",
    collect() {
      const memoryData = process.memoryUsage();
      this.set(memoryData.rss); // Resident Set Size (RSS) - memory allocated in the V8 heap and C++ bindings
    },
  });

  new Gauge({
    name: "system_load_average",
    help: "System load average (1 minute)",
    collect() {
      const loadAverage = os.loadavg()[0]; // 1-minute load average
      this.set(loadAverage);
    },
  });

  // middleware to track request metrics
  app.use((req, res, next) => {
    const end = requestDuration.startTimer();
    const route = req.originalUrl || req.url;

    res.on("finish", () => {
      requestCount.inc({
        method: req.method,
        route,
        status_code: res.statusCode,
      });
      end({ method: req.method, route, status_code: res.statusCode });
    });
    next();
  });

  // metrics endpoint
  app.get("/metrics", async (_req, res) => {
    try {
      const metrics = await register.metrics(); // Wait for the metrics
      res.set("Content-Type", register.contentType);
      res.end(metrics); // Send the resolved string to the response
    } catch {
      res.status(500).send("Error fetching metrics");
    }
  });

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
