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
  console.log(
    `Scaffolding project: ${projectName} (${slug}) with frontend: ${frontend}, backend: ${backend}, databases: ${databases.join(", ")}, dbConnector: ${dbConnector.join(", ")}, logging: ${logging.join(", ")}, monitoring: ${monitoring.join(", ")}, testing: ${testing.join(", ")}, auth: ${auth}`
  );

  const templateRoot = path.resolve("src/templates/fullstack-react-express");
  const isDev = process.env.NODE_ENV === "development";

  const basePath = isDev
    ? path.join(__dirname, "..", "projects") // local path like ./src/projects
    : "/usr/src/app/projects"; // Docker-mounted path

  const projectRoot = path.join(basePath, slug);

  await fs.copy(templateRoot, projectRoot);

  // Inject custom .env
  const envContent = `
  DATABASE_URL=postgresql://postgres:passwordlaunchpad@localhost:5432/${slug}
  `;
  await fs.writeFile(path.join(projectRoot, ".env"), envContent);

  // Replace placeholders in Dockerfile or config
  const composePath = path.join(projectRoot, "docker-compose.yml");

  if (!(await fs.pathExists(composePath))) {
    throw new Error(`Missing docker-compose.yml at ${composePath}`);
  }
  const composeContent = await fs.readFile(composePath, "utf-8");

  const updatedCompose = composeContent.replace(/{{PROJECT_SLUG}}/g, slug);
  await fs.writeFile(composePath, updatedCompose);

  // Save a pristine template version to use at deploy time
  const templatePath = path.join(projectRoot, "template.yml");
  await fs.writeFile(templatePath, composeContent);

  // create readme file
  const readmeContent = `
# ${projectName}

## Description
This is a project scaffolded by LaunchPad.

## Getting Started
1. Clone the repository
2. Install dependencies
3. Run the project
`;
  await fs.writeFile(path.join(projectRoot, "README.md"), readmeContent);

  return projectRoot;
}
