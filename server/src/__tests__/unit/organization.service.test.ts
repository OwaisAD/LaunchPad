import { describe, it, expect, beforeEach, vi } from "vitest";
import { getOrganizations } from "../../services/organization.services";
import prisma from "../../../prisma/client";

vi.mock("../../../prisma/client", () => {
  return {
    default: {
      organization: {
        findMany: vi.fn(),
      },
    },
  };
});
describe("Organization Service", () => {
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
