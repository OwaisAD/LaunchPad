import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import prisma from "../../prisma/client";

const getOrganization = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    console.log("User ID from Clerk:", userId);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        Organization: true,
      },
    });

    console.log("User data from Prisma:", user);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const organization = user.Organization;

    res.status(200).json({
      organization,
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOrganizationByIdOrSlug = async (req: Request, res: Response) => {};

const createOrganization = async (req: Request, res: Response) => {};

const updateOrganization = async (req: Request, res: Response) => {};

const deleteOrganization = async (req: Request, res: Response) => {};

export default {
  getOrganization,
  getOrganizationByIdOrSlug,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
