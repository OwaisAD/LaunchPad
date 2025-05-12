import express from "express";
import organizationController from "../controllers/organization.controller";
import { requireAuth } from "@clerk/express";

const OrganizationRouter = express.Router();

OrganizationRouter.get("/", requireAuth(), organizationController.handleGetUserOrganizations);
OrganizationRouter.post("/", requireAuth(), organizationController.handleCreateOrganization);
OrganizationRouter.get("/:slug", requireAuth(), organizationController.getOrganizationBySlug);
OrganizationRouter.post("/:id/invite", requireAuth(), organizationController.inviteMember);
//OrganizationRouter.post("/:id/join", requireAuth(), organizationController.joinOrganization);
//OrganizationRouter.post("/:id/leave", requireAuth(), organizationController.leaveOrganization);
OrganizationRouter.post("/:id/role", requireAuth(), organizationController.changeRole);

export default OrganizationRouter;
