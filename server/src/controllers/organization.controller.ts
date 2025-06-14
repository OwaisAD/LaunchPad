import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { validateUser } from "../utils/validateUser";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { createOrganizationSchema } from "../validations/createOrganizationSchema";
import { logger } from "../utils/logger";
import { ZodError } from "zod";
import { getZodErrors } from "../validations/handleZodErrors";
import { createOrganization, getOrganizations, inviteMember } from "../services/organization.services";

const handleGetUserOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);
    const organizations = await getOrganizations(userId);
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

const getOrganizationBySlug = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);
    const { slug } = req.params;

    const organization = await prisma.organization.findUnique({
      where: {
        slug,
        Membership: {
          some: {
            userId,
          },
        },
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
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json({
      organization,
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleInviteMember = async (req: Request, res: Response) => {
  try {
    // check if user exists and add to organization
    const userId = validateUser(req);
    const { email } = req.body;
    const { id: organizationId } = req.params;

    const result = await inviteMember(userId, organizationId, email);

    res.status(200).json(result);
    // validate
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }

    console.error("Error inviting member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const deleteOrganization = async (req: Request, res: Response) => {
//   try {
//     const userId = validateUser(req);
//     const { id } = req.params;

//     const organization = await prisma.organization.findUnique({
//       where: {
//         id,
//         Membership: {
//           some: {
//             userId,
//             role: "ADMIN",
//           },
//         },
//       },
//     });

//     if (!organization) {
//       res.status(404).json({ error: "Organization not found" });
//       return;
//     }

//     await prisma.organization.delete({
//       where: { id },
//     });

//     res.status(200).json({ message: "Organization deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting organization:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const changeRole = async (req: Request, res: Response) => {
  try {
    const userId = validateUser(req);
    const { id } = req.params;
    const { email, role } = req.body;

    // validate role
    const validRoles = ["ADMIN", "USER"];

    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    const organization = await prisma.organization.findUnique({
      where: {
        id,
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
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    const isAdmin = organization.Membership.some(
      (member: { userId: string; role: string }) => member.userId === userId && member.role === "ADMIN"
    );

    if (!isAdmin) {
      res.status(403).json({ error: "You are not authorized to change roles in this organization." });
      return;
    }

    const userToChange = organization.Membership.find(
      (member: { userId: string; role: string; user: { email: string } }) => member.user.email === email
    );

    if (!userToChange) {
      res.status(404).json({ error: `User with email ${email} not found in the organization` });
      return;
    }

    await prisma.membership.update({
      where: {
        id: userToChange.id,
      },
      data: {
        role,
      },
    });

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error changing role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  handleGetUserOrganizations,
  handleCreateOrganization,
  getOrganizationBySlug,
  // deleteOrganization,
  handleInviteMember,
  changeRole,
};
