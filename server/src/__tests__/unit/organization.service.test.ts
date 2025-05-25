import { describe, it, expect, beforeEach, vi } from "vitest";
import { createOrganization, getOrganizations, inviteMember } from "../../services/organization.services";
import prisma from "../../../prisma/client";

vi.mock("../../../prisma/client", () => {
  return {
    default: {
      organization: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      membership: {
        create: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
    },
  };
});
describe("Organization Service - get user organizations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return organizations for a valid user", async () => {
    const expectedOrganizations = [
      {
        id: "org1",
        name: "Organization 1",
        slug: "organization1",
        description: "Description 1",
        logo: "logo1.png",
        website: "https://example1.com",
        location: "Location 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "org2",
        name: "Organization 2",
        slug: "organization2",
        description: "Description 2",
        logo: "logo2.png",
        website: "https://example2.com",
        location: "Location 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const findManyMock = prisma.organization.findMany as unknown as ReturnType<typeof vi.fn>;
    findManyMock.mockResolvedValue(expectedOrganizations);

    const result = await getOrganizations("testUserId");

    expect(result).toEqual(expectedOrganizations);
    expect(findManyMock).toHaveBeenCalledTimes(1);
    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        Membership: {
          some: {
            userId: "testUserId",
          },
        },
      },
    });
  });

  it("should throw an error when prisma throws", async () => {
    const findManyMock = vi.fn().mockRejectedValue(new Error("DB failure"));
    prisma.organization.findMany = findManyMock;

    await expect(getOrganizations("user1")).rejects.toThrow("DB failure");
  });

  it("should return an empty array when no organizations are found", async () => {
    const findManyMock = vi.fn().mockResolvedValue([]);
    prisma.organization.findMany = findManyMock;

    const result = await getOrganizations("user-without-orgs");

    expect(result).toEqual([]);
    expect(findManyMock).toHaveBeenCalledTimes(1);
  });
});

describe("Organization Service - create organization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new organization and return it", async () => {
    const newOrganization = {
      name: "New Organization",
      description: "A new organization",
      website: "https://neworg.com",
      location: "New Location",
    };

    const expectedOrganization = {
      id: "newOrgId",
      ...newOrganization,
      slug: "new-organization",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createMock = vi.fn().mockResolvedValue(expectedOrganization);
    prisma.organization.create = createMock;

    const result = await createOrganization("testUserId", newOrganization);

    expect(result).toEqual(expectedOrganization);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        ...newOrganization,
        slug: "new-organization",
        owner: {
          connect: { id: "testUserId" },
        },
      },
    });
  });

  it("should throw an error if organization with the same slug already exists", async () => {
    const existingOrganization = {
      id: "existingOrgId",
      name: "Existing Organization",
      slug: "existing-organization",
    };

    const findUniqueMock = vi.fn().mockResolvedValue(existingOrganization);
    prisma.organization.findUnique = findUniqueMock;

    await expect(
      createOrganization("testUserId", { name: "Existing Organization", description: "", website: "", location: "" })
    ).rejects.toThrow("Can't create organization with this name. Please try another name.");

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { slug: "existing-organization" },
    });
  });

  it("Shold create a membership entry for the new organization", async () => {
    const newOrganization = {
      id: "newOrgId",
      name: "New Organization",
      description: "A new organization",
      website: "https://neworg.com",
      location: "New Location",
      slug: "new-organization",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const findUniqueOrganizationMock = vi.fn().mockResolvedValue(null);
    prisma.organization.findUnique = findUniqueOrganizationMock;

    const membershipCreateMock = vi.fn();
    prisma.membership.create = membershipCreateMock;

    await createOrganization("testUserId", {
      name: "New Organization",
      description: "A new organization",
      website: "https://neworg.com",
      location: "New Location",
    });

    expect(findUniqueOrganizationMock).toHaveBeenCalledWith({
      where: { slug: "new-organization" },
    });
    expect(membershipCreateMock).toHaveBeenCalledTimes(1);
    expect(membershipCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "testUserId",
        organizationId: newOrganization.id,
        role: "ADMIN",
      },
    });
  });

  it("should throw an error if prisma throws during organization creation", async () => {
    const createMock = vi.fn().mockRejectedValue(new Error("DB failure"));
    prisma.organization.create = createMock;

    await expect(
      createOrganization("testUserId", { name: "New Organization", description: "", website: "", location: "" })
    ).rejects.toThrow("DB failure");
  });
});

describe("Organization Service - invite member to organization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add user to organization when all checks pass", async () => {
    const mockOrganization = {
      id: "org1",
      Membership: [
        {
          userId: "adminUser",
          role: "ADMIN",
          user: { email: "admin@example.com" },
        },
      ],
    };

    (prisma.organization.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrganization);

    (prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "newUserId",
      email: "newuser@example.com",
    });

    const membershipCreateMock = vi.fn().mockResolvedValue({});
    prisma.membership.create = membershipCreateMock;

    const result = await inviteMember("adminUser", "org1", "newuser@example.com");

    expect(result).toEqual({ message: "User added to organization successfully" });
    expect(membershipCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "newUserId",
        organizationId: "org1",
        role: "USER",
      },
    });
  });

  it("should throw error if user already in organization", async () => {
    const mockOrganization = {
      id: "org1",
      Membership: [
        {
          userId: "adminUser",
          role: "ADMIN",
          user: { email: "admin@example.com" },
        },
        {
          userId: "newUser",
          role: "USER",
          user: { email: "newuser@example.com" },
        },
      ],
    };

    (prisma.organization.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrganization);

    await expect(inviteMember("adminUser", "org1", "newuser@example.com")).rejects.toThrow(
      "User already exists in the organization"
    );
  });

  it("should throw error if invited user does not exist", async () => {
    const mockOrganization = {
      id: "org1",
      Membership: [
        {
          userId: "adminUser",
          role: "ADMIN",
          user: { email: "admin@example.com" },
        },
      ],
    };

    (prisma.organization.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrganization);
    (prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(inviteMember("adminUser", "org1", "nonexistent@example.com")).rejects.toThrow(
      "User with email nonexistent@example.com not found"
    );
  });

  it("should throw error if inviter is not an admin", async () => {
    const mockOrganization = {
      id: "org1",
      Membership: [
        {
          userId: "regularUser",
          role: "USER",
          user: { email: "user@example.com" },
        },
      ],
    };

    (prisma.organization.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrganization);

    await expect(inviteMember("regularUser", "org1", "newuser@example.com")).rejects.toThrow(
      "You are not authorized to invite members to this organization."
    );
  });

  it("should throw error if organization not found", async () => {
    (prisma.organization.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(inviteMember("adminUser", "org1", "newuser@example.com")).rejects.toThrow("Organization not found");
  });
});
