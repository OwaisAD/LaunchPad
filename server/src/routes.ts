import { Express, Request, Response } from "express";
// import AuthRouter from "./routes/auth.routes";
import UsersRouter from "./routes/users.routes";

function routes(app: Express) {
  app.get("/", (_req: Request, res: Response) => {
    res.send(`Hello from LaunchPad API!`);
  });

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.sendStatus(200).end();
  });

  // Register API routes
  // app.use("/auth", AuthRouter);
  app.use("/users", UsersRouter);

  // Catch unregistered routes
  app.all("/{*any}", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

export default routes;
