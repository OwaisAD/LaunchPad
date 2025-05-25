import express from "express";
import projectController from "../controllers/project.controller";
import { requireAuth } from "@clerk/express";
import { mockRequireAuth } from "../utils/testAuth";

const authMiddleware = process.env.NODE_ENV === "test" ? mockRequireAuth : requireAuth();

const ProjectRoute = express.Router();

ProjectRoute.post("/", authMiddleware, projectController.handleCreateProject);
ProjectRoute.get("/", authMiddleware, projectController.handleGetUserProjects);
ProjectRoute.get("/:slug", authMiddleware, projectController.handleGetProjectBySlug);

export default ProjectRoute;
