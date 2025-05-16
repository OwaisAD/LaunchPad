import { create } from "zustand";

interface ProjectDataState {
  selectedProject: {
    name: string;
    slug: string;
  };
  projects: {
    id: string;
    name: string;
    description: string;
    slug: string;
    status: string;
    stack: string;
    organizationId: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      logo: string | null;
      website: string;
    };
    createdBy: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      imageUrl: string | null;
    };
  }[];
  setSelectedProject: (selectedProject: { name: string; slug: string }) => void;
  setProjects: (
    projects: {
      id: string;
      name: string;
      description: string;
      slug: string;
      status: string;
      stack: string;
      organizationId: string;
      createdById: string;
      createdAt: string;
      updatedAt: string;
      organization: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        website: string;
      };
      createdBy: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        imageUrl: string | null;
      };
    }[]
  ) => void;
  clearCommonData: () => void;
}

export const useProjectDataStore = create<ProjectDataState>((set) => ({
  selectedProject: {
    name: "",
    slug: "",
  },
  projects: [],
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  setProjects: (projects) => set({ projects }),
  clearCommonData: () =>
    set({
      selectedProject: {
        name: "",
        slug: "",
      },
      projects: [],
    }),
}));
