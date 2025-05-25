import express from "express";
import organizationController from "../controllers/organization.controller";
import { requireAuth } from "@clerk/express";
import { mockRequireAuth } from "../utils/testAuth";

const authMiddleware = process.env.NODE_ENV === "test" ? mockRequireAuth : requireAuth();

const OrganizationRouter = express.Router();

OrganizationRouter.get("/", authMiddleware, organizationController.handleGetUserOrganizations);
OrganizationRouter.post("/", authMiddleware, organizationController.handleCreateOrganization);
OrganizationRouter.get("/:slug", authMiddleware, organizationController.getOrganizationBySlug);
OrganizationRouter.post("/:id/invite", authMiddleware, organizationController.handleInviteMember);
//OrganizationRouter.post("/:id/join", authMiddleware, organizationController.joinOrganization);
//OrganizationRouter.post("/:id/leave", authMiddleware, organizationController.leaveOrganization);
OrganizationRouter.post("/:id/role", authMiddleware, organizationController.changeRole);

export default OrganizationRouter;
