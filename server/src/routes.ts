import { Express, Request, Response } from "express";
import OrganizationRouter from "./routes/organization.routes";
import TechOptionsRouter from "./routes/tech-options.routes";
import ProjectRouter from "./routes/project.routes";
import HooksRoute from "./routes/hooks.routes";

function routes(app: Express) {
  // app.get("/", (_req: Request, res: Response) => {
  //   res.status(200).json({ message: "Welcome to Launchpad API" });
  // });

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.sendStatus(200).end();
  });

  // Register API routes
  app.use("/organizations", OrganizationRouter);
  app.use("/tech-options", TechOptionsRouter);
  app.use("/projects", ProjectRouter);
  app.use("/hooks", HooksRoute);

  // Catch unregistered routes
  app.all("/{*any}", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

export default routes;
