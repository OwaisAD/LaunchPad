import express from "express";
import organizationController from "../controllers/organization.controller";
import { requireAuth } from "@clerk/express";

const OrganizationRouter = express.Router();

OrganizationRouter.get("/", organizationController.handleGetUserOrganizations);
OrganizationRouter.post("/", requireAuth(), organizationController.handleCreateOrganization);
OrganizationRouter.get("/:slug", requireAuth(), organizationController.getOrganizationBySlug);
OrganizationRouter.delete("/:id", requireAuth(), organizationController.deleteOrganization);
// OrganizationRouter.get("/:id",requireAuth(), organizationController.getOrganizationById);
// OrganizationRouter.put("/:id",requireAuth(), organizationController.updateOrganization);

export default OrganizationRouter;
