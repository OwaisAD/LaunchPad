import { describe, it, expect, beforeEach, vi } from "vitest";
import prisma from "../../../prisma/client";
import { pushToGitHub } from "../../utils/pushToGitHub";
import { scaffoldProject } from "../../utils/scaffoldProject";
import { createProject, getUserProjects } from "../../services/project.services";

vi.mock("../../../prisma/client", () => ({
  default: {
    organization: { findUnique: vi.fn() },
    project: { findFirst: vi.fn(), create: vi.fn(), findMany: vi.fn() },
  },
}));
vi.mock("../../utils/scaffoldProject", () => ({
  scaffoldProject: vi.fn(),
}));
vi.mock("../../utils/pushToGitHub", () => ({
  pushToGitHub: vi.fn(),
}));

describe("Project Service - create project", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockData = {
    orgSlug: "my-org",
    projectName: "My Project",
    description: "This is a test project",
    frontend: "React",
    backend: "Node",
    databases: ["PostgreSQL"],
    repo: "my-repo",
  };

  it("should create project if user is admin and project does not exist", async () => {
    const mockOrg = {
      slug: "my-org",
      Membership: [{ userId: "adminUser", role: "ADMIN" }],
    };
    const mockProject = {
      slug: "my-project",
    };

    const findUniqueMock = vi.fn().mockResolvedValue(mockOrg);
    prisma.organization.findUnique = findUniqueMock;

    const findFirstMock = vi.fn().mockResolvedValue(null);
    prisma.project.findFirst = findFirstMock;

    const createMock = vi.fn().mockResolvedValue(mockProject);
    prisma.project.create = createMock;

    (scaffoldProject as unknown as ReturnType<typeof vi.fn>).mockResolvedValue("/project/path");
    (pushToGitHub as unknown as ReturnType<typeof vi.fn>).mockResolvedValue("https://github.com/my-repo");

    const result = await createProject("adminUser", mockData);

    expect(result).toEqual({
      message: "Project created successfully",
      slug: "my-project",
    });
    expect(prisma.organization.findUnique).toHaveBeenCalled();
    expect(scaffoldProject).toHaveBeenCalled();
    expect(pushToGitHub).toHaveBeenCalled();
    expect(prisma.project.create).toHaveBeenCalled();
  });

  it("should throw error if user is not an admin", async () => {
    const mockOrg = {
      slug: "my-org",
      Membership: [{ userId: "regularUser", role: "USER" }],
    };

    (prisma.organization.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrg);

    await expect(createProject("regularUser", mockData)).rejects.toThrow("User is not an admin of the organization");
  });

  it("should throw error if project already exists", async () => {
    const findUniqueMock = vi.fn().mockResolvedValue({
      slug: "my-org",
      Membership: [{ userId: "adminUser", role: "ADMIN" }],
    });
    prisma.organization.findUnique = findUniqueMock;

    const findFirstMock = vi.fn().mockResolvedValue({
      slug: "my-project",
    });
    prisma.project.findFirst = findFirstMock;

    await expect(createProject("adminUser", mockData)).rejects.toThrow(
      "Project with the same name or slug already exists"
    );
  });
});

describe("Project Service - getUserProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return projects for the user", async () => {
    const mockProjects = [
      {
        id: "proj1",
        name: "Project 1",
        slug: "project-1",
        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          imageUrl: "image.png",
        },
        organization: {
          id: "org1",
          name: "Org 1",
          slug: "org-1",
          logo: "logo.png",
          website: "https://org1.com",
        },
      },
    ];

    (prisma.project.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProjects);

    const result = await getUserProjects("user1");

    expect(result).toEqual(mockProjects);
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: {
        organization: {
          Membership: {
            some: {
              userId: "user1",
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
  });

  it("should return empty array if no projects found", async () => {
    (prisma.project.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const result = await getUserProjects("user1");

    expect(result).toEqual([]);
  });
});
