import { logger } from "../utils/logger";
import prisma from "../../prisma/client";
import slugify from "slugify";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { scaffoldProject } from "../utils/scaffoldProject";
import { pushToGitHub } from "../utils/pushToGitHub";
import { projectsCreatedCounter } from "../utils/server";

export async function createProject(
  userId: string,
  data: {
    orgSlug: string;
    projectName: string;
    description?: string;
    frontend: string;
    backend: string;
    databases: string[];
    dbConnector?: string[];
    logging?: string[];
    monitoring?: string[];
    testing?: string[];
    auth?: string;
    repo: string;
  }
) {
  const slug = slugify(data.projectName, {
    lower: true,
    strict: true,
    replacement: "-",
    trim: true,
  });

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

  if (!org) throw new Error("Organization not found");

  if (org.Membership.length === 0 || org.Membership[0].role !== "ADMIN") {
    throw new UnauthorizedError("User is not an admin of the organization");
  }

  // check if project already exists
  const existingProject = await prisma.project.findFirst({
    where: {
      slug,
    },
  });

  if (existingProject) throw new Error("Project with the same name or slug already exists");

  // Scaffold the project
  const projectLocation = await scaffoldProject({
    projectName: data.projectName,
    slug,
    frontend: data.frontend,
    backend: data.backend,
    databases: data.databases || [],
    dbConnector: data.dbConnector || [],
    logging: data.logging || [],
    monitoring: data.monitoring || [],
    testing: data.testing || [],
    auth: data.auth || "",
  });

  // Push to GitHub
  const url = await pushToGitHub({
    projectName: data.projectName,
    slug,
    repo: data.repo,
    projectLocation,
  });

  // Create the project in the database
  const result = await prisma.project.create({
    data: {
      name: data.projectName,
      slug,
      description: data.description || "",
      stack: JSON.stringify(data),
      status: "PENDING",
      repositoryUrl: url,
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

  projectsCreatedCounter.inc();

  logger.info("Project created successfully", { projectId: result.id, slug });
  return {
    message: "Project created successfully",
    slug,
  };
}

export async function getUserProjects(userId: string) {
  return await prisma.project.findMany({
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
      organization: true,
    },
  });
}
