import { logger } from "../utils/logger";
import prisma from "../../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import slugify from "slugify";

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
        ...organization,
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
      throw error;
    }

    logger.error("Error creating organization:", error);
    throw new Error("Internal server error");
  }
}

async function inviteMember(userId: string, organizationId: string, email: string) {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      Membership: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const isAdmin = organization.Membership.some(
    (member: { userId: string; role: string }) => member.userId === userId && member.role === "ADMIN"
  );

  if (!isAdmin) {
    throw new Error("You are not authorized to invite members to this organization.");
  }

  const userAlreadyExists = organization.Membership.some(
    (member: { userId: string; role: string; user: { email: string } }) => member.user.email === email
  );

  if (userAlreadyExists) {
    throw new Error("User already exists in the organization");
  }

  // check if user exists in system
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  // add user to organization
  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: "USER",
    },
  });

  return { message: "User added to organization successfully" };
}

export { createOrganization, getOrganizations, inviteMember };
