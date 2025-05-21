import { logger } from "../utils/logger";
import prisma from "../../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import slugify from "slugify";

async function createOrganization(
  userId: string,
  organization: {
    name: string;
    description: string;
    website: string;
    location: string;
  }
) {
  try {
    const slug = slugify(organization.name, {
      lower: true,
      strict: true,
      replacement: "-",
      trim: true,
    });

    const existingOrganization = await prisma.organization.findUnique({
      where: {
        slug,
      },
    });

    if (existingOrganization) {
      throw new Error("Can't create organization with this name. Please try another name.");
    }

    const newOrganization = await prisma.organization.create({
      data: {
        name: organization.name,
        description: organization.description,
        website: organization.website,
        location: organization.location,
        slug,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await prisma.membership.create({
      data: {
        userId,
        organizationId: newOrganization.id,
        role: "ADMIN",
      },
    });

    return newOrganization;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Organization with this name already exists.");
      }
    }

    if (error instanceof Error) {
      logger.error("Error creating organization:", error.message);
      throw new Error(error.message);
    }

    logger.error("Error creating organization:", error);
    throw new Error("Internal server error");
  }
}

async function getOrganizations(userId: string) {
  return await prisma.organization.findMany({
    where: {
      Membership: {
        some: {
          userId,
        },
      },
    },
  });
}

export { createOrganization, getOrganizations };
