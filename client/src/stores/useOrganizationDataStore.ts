import { create } from "zustand";

interface OrganizationDataState {
  selectedOrg: {
    name: string;
    slug: string;
  };
  organizations: {
    id: string;
    name: string;
    description: string;
    website: string;
    location: string;
    slug: string;
    ownerId: string;
  }[];
  setSelectedOrg: (selectedOrg: { name: string; slug: string }) => void;
  setOrganizations: (
    organizations: {
      id: string;
      name: string;
      description: string;
      website: string;
      location: string;
      slug: string;
      ownerId: string;
    }[]
  ) => void;
  clearCommonData: () => void;
}

export const useOrganizationDataStore = create<OrganizationDataState>((set) => ({
  selectedOrg: {
    name: "",
    slug: "",
  },
  organizations: [],
  setSelectedOrg: (selectedOrg) => set({ selectedOrg }),
  setOrganizations: (organizations) => set({ organizations }),
  clearCommonData: () =>
    set({
      selectedOrg: {
        name: "",
        slug: "",
      },
      organizations: [],
    }),
}));
