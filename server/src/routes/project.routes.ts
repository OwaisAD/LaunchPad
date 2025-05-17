import express from "express";
import projectController from "../controllers/project.controller";
import { requireAuth } from "@clerk/express";

const ProjectRoute = express.Router();

ProjectRoute.post("/", requireAuth(), projectController.handleCreateProject);
ProjectRoute.get("/", requireAuth(), projectController.handleGetUserProjects);
ProjectRoute.get("/:slug", requireAuth(), projectController.handleGetProjectBySlug);

export default ProjectRoute;
