import { Request, Response } from "express";
import { exec as execRaw } from "child_process";
import { promisify } from "util";
import { createNginxConfig } from "../utils/createNginxConfig";

const exec = promisify(execRaw);

const handleDeployWebhook = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { slug } = req.body;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authorization.split(" ")[1];
  if (token !== process.env.LAUNCHPAD_DEPLOY_TOKEN) {
    res.status(403).json({ error: "Invalid deploy token" });
    return;
  }

  if (!slug) {
    res.status(400).json({ error: "Missing project slug" });
    return;
  }

  const projectPath = `/root/projects/${slug}`;
  const composeFile = `${projectPath}/docker-compose.yml`;

  try {
    console.log("Starting docker compose...");
    await exec(`docker compose -f ${composeFile} up -d`);

    console.log("Creating NGINX config...");
    await createNginxConfig(slug);

    console.log("Connecting to NGINX network...");
    await exec(`docker network connect launchpad-${slug} nginx`);

    console.log("Reloading NGINX...");
    await exec("nginx -s reload");

    res.status(200).json({ message: "Deployment complete" });
  } catch (error) {
    console.error("Deployment error:", error);
    res.status(500).json({ error: "Deployment failed", details: (error as Error).message });
  }
};

export default {
  handleDeployWebhook,
};
