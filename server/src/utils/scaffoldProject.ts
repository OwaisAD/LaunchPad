import fs from "fs-extra";
import path from "path";

interface ScaffoldOptions {
  projectName: string;
  slug: string;
  frontend: string;
  backend: string;
  databases: string[];
  dbConnector: string[];
  logging: string[];
  monitoring: string[];
  testing: string[];
  auth: string;
}

export async function scaffoldProject(options: ScaffoldOptions): Promise<string> {
  const { projectName, slug, frontend, backend, databases, dbConnector, logging, monitoring, testing, auth } = options;

  console.log("Scaffolding project with options:", {
    projectName,
    slug,
    frontend,
    backend,
    databases,
    dbConnector,
    logging,
    monitoring,
    testing,
    auth,
  });

  const templateRoot = path.resolve("src/templates/fullstack-react-express");
  const projectRoot = path.join("./src/projects", slug);

  await fs.copy(templateRoot, projectRoot);

  // Inject custom .env
  const envContent = `
  DATABASE_URL=postgresql://postgres:passwordlaunchpad@localhost:5432/${slug}
  `;
  await fs.writeFile(path.join(projectRoot, ".env"), envContent);

  // Replace placeholders in Dockerfile or config
  const composePath = path.join(projectRoot, "docker-compose.yml");

  console.log(composePath);
  if (!(await fs.pathExists(composePath))) {
    throw new Error(`Missing docker-compose.yml at ${composePath}`);
  }
  const composeContent = await fs.readFile(composePath, "utf-8");

  const updatedCompose = composeContent.replace(/{{PROJECT_SLUG}}/g, slug);
  await fs.writeFile(composePath, updatedCompose);

  return projectRoot;
}
