import { Express, Request, Response } from "express";

function routes(app: Express) {
  app.get("/", (_req: Request, res: Response) => {
    res.send(`Hello from LaunchPad API!`);
  });

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Register API routes

  // Catch unregistered routes
  app.all("/{*any}", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

export default routes;
