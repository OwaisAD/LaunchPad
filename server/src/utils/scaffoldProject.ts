import fs from "fs-extra";
import path from "path";

interface ScaffoldOptions {
  projectName: string;
  slug: string;
  frontend: string;
  backend: string;
  databases: string[];
  dbConnector: string;
  logging: boolean;
  monitoring: boolean;
  testing: boolean;
  auth: boolean;
}

export async function scaffoldProject(options: ScaffoldOptions): Promise<string> {
  const { projectName, slug, frontend, backend, databases, dbConnector, logging, monitoring, testing, auth } = options;

  const templateRoot = path.join(__dirname, "..", "templates", "fullstack-react-express");
  const projectRoot = path.join("/projects", slug);

  await fs.copy(templateRoot, projectRoot);

  // Inject custom .env
  const envContent = `
  DATABASE_URL=postgresql://postgres:passwordlaunchpad@localhost:5432/${slug}
  `;
  await fs.writeFile(path.join(projectRoot, ".env"), envContent);

  // Replace placeholders in Dockerfile or config
  const composePath = path.join(projectRoot, "docker-compose.yml");
  const composeContent = await fs.readFile(composePath, "utf-8");

  const updatedCompose = composeContent.replace(/{{PROJECT_SLUG}}/g, slug);
  await fs.writeFile(composePath, updatedCompose);

  return projectRoot;
}
