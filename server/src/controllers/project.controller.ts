import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { validateUser } from "../utils/validateUser";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { logger } from "../utils/logger";
import { ZodError } from "zod";
import { getZodErrors } from "../validations/handleZodErrors";
import z from "zod";
import slugify from "slugify";

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

    const data = parsed.data;
    const slug = slugify(data.projectName, {
      lower: true,
      strict: true,
      replacement: "-",
      trim: true,
    });

    console.log("Parsed data:", data);
    console.log("Slug:", slug);
    console.log("Orgslug", data.orgSlug);

    // validate if the user is part of the organization and admin

    const org = await prisma.organization.findUnique({
      where: {
        slug: data.orgSlug,
      },
      include: {
        Membership: {
          where: {
            userId,
          },
        },
      },
    });

    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }
    if (org.Membership[0].role !== "ADMIN") {
      res.status(403).json({ error: "User is not an admin of the organization" });
      return;
    }

    // check if project already exists
    const existingProject = await prisma.project.findFirst({
      where: {
        slug,
      },
    });

    if (existingProject) {
      res.status(400).json({ error: "Project with the same name or slug already exists" });
      return;
    }

    const result = await prisma.project.create({
      data: {
        name: data.projectName,
        slug,
        description: data.description || "",
        stack: JSON.stringify(data),
        status: "PENDING",
        organization: {
          connect: {
            slug: data.orgSlug,
          },
        },
        createdBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    console.log(result);

    res.status(200).json({
      message: "Project created successfully",
    });
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

    logger.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetUserProjects = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);

    const projects = await prisma.project.findMany({
      where: {
        organization: {
          Membership: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
          },
        },
      },
    });

    if (!projects.length) {
      res.status(404).json({ error: "No projects found" });
      return;
    }

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

    logger.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const handleGetProjectBySlug = async (req: Request, res: Response) => {
//   try {
//     console.log("Get project by slug");
//     res.status(200).json({
//       message: "Get project by slug",
//     });
//   } catch (error) {}
// };

export default {
  handleCreateProject,
  handleGetUserProjects,
  // handleGetProjectBySlug,
};
