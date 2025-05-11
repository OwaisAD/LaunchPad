import express from "express";
import organizationController from "../controllers/organization.controller";
import { requireAuth } from "@clerk/express";

const OrganizationRouter = express.Router();

OrganizationRouter.get("/", requireAuth(), organizationController.handleGetUserOrganizations);
OrganizationRouter.post("/", organizationController.handleCreateOrganization);
// OrganizationRouter.get("/:id", organizationController.getOrganizationByIdOrSlug);
// OrganizationRouter.put("/:id", organizationController.updateOrganization);
// OrganizationRouter.delete("/:id", organizationController.deleteOrganization);

export default OrganizationRouter;
