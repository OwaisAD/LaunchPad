import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { validateUser } from "../utils/validateUser";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { logger } from "../utils/logger";
import { ZodError } from "zod";
import { getZodErrors } from "../validations/handleZodErrors";
import z from "zod";
import { createProject, getUserProjects } from "../services/project.services";
// import fs from "fs-extra";
// import { cleanUpProjectFolder } from "../utils/cleanUpProjectFolder";

const projectSchema = z.object({
  orgSlug: z.string().min(1),
  projectName: z.string().min(1),
  description: z.string().optional(),
  frontend: z.string(),
  backend: z.string(),
  databases: z.array(z.string()),
  repo: z.string(),
  dbConnector: z.array(z.string()).optional(),
  logging: z.array(z.string()).optional(),
  monitoring: z.array(z.string()).optional(),
  testing: z.array(z.string()).optional(),
  auth: z.string().optional(),
});

const handleCreateProject = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);
    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    const result = await createProject(userId, parsed.data);

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof ZodError) {
      res.status(400).json({ error: getZodErrors(error) });
      return;
    }

    logger.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetUserProjects = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const projects = await getUserProjects(userId);

    res.status(200).json({ projects });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof ZodError) {
      res.status(400).json({ error: getZodErrors(error) });
      return;
    }

    logger.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetProjectBySlug = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);
    const { slug } = req.params;

    // get a project that the user is part of
    const project = await prisma.project.findFirst({
      where: {
        slug,
        organization: {
          Membership: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.status(200).json({ project });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof ZodError) {
      const zodErrors = getZodErrors(error);
      res.status(400).json({ error: zodErrors });
      return;
    }

    logger.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetUserProjectsByOrganization = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  
    const { orgSlug } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { slug: orgSlug },
      include: {
        Membership: {
          where: { userId },
          select: { userId: true },
        },
      },
    });
    if (!organization || organization.Membership.length === 0) {
      res.status(404).json({ error: "Organization not found or user not a member" });
      return;
    }
    const projects = await prisma.project.findMany({
      where: { organizationId: organization.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });
    res.status(200).json({ projects });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
      return;
    }
    if (error instanceof ZodError) {
      const zodErrors = getZodErrors(error);
      res.status(400).json({ error: zodErrors });
      return;
    }
    logger.error("Error fetching projects by organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  handleCreateProject,
  handleGetUserProjects,
  handleGetProjectBySlug,
  handleGetUserProjectsByOrganization,
};
