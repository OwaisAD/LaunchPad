export type OutletContextType = {
  project: {
    id: string;
    name: string;
    description: string;
    slug: string;
    status: string;
    stack: string;
    repositoryUrl: string | null;
    createdAt: string;
    updatedAt: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      ownerId: string;
      createdAt: string;
      updatedAt: string;
    };
    createdById: string;
    createdBy: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      imageUrl: string | null;
    };
  };
};
