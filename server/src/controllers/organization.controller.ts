import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { validateUser } from "../utils/validateUser";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { createOrganizationSchema } from "../validations/createOrganizationSchema";
import { logger } from "../utils/logger";
import { ZodError } from "zod";
import { getZodErrors } from "../validations/handleZodErrors";
import { createOrganization } from "../services/organization.services";

const handleGetUserOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Organization: true,
      },
    });

    console.log("User data from Prisma:", user);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const organizations = user.Organization;

    res.status(200).json({
      organizations,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleCreateOrganization = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);

    const { name, description, website, location } = req.body;

    createOrganizationSchema.parse({
      name,
      description,
      website,
      location,
    });

    const organization = await createOrganization(userId, {
      name,
      description,
      website,
      location,
    });

    res.status(201).json({
      organization,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Error during login", {
        errorMessages: getZodErrors(error),
      });
      res.status(400).json({ errors: getZodErrors(error) });
    }

    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getOrganizationByIdOrSlug = async (req: Request, res: Response) => {};

// const updateOrganization = async (req: Request, res: Response) => {};

// const deleteOrganization = async (req: Request, res: Response) => {};

export default {
  handleGetUserOrganizations,
  handleCreateOrganization,
  // getOrganizationByIdOrSlug,
  // updateOrganization,
  // deleteOrganization,
};
