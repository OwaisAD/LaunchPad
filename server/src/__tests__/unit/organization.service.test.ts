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

  it("should call prisma to get organizations", async () => {
    const mockOrganizations = [
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
    findManyMock.mockResolvedValue(mockOrganizations);

    const result = await getOrganizations("testUserId");

    expect(result).toEqual(mockOrganizations);
    expect(prisma.organization.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.organization.findMany).toHaveBeenCalledWith({
      where: {
        Membership: {
          some: {
            userId: "testUserId",
          },
        },
      },
    });
  });
});
