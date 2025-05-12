export type OutletContextType = {
  organization: {
    id: string;
    name: string;
    description: string;
    logo: string | null;
    slug: string;
    website: string;
    location: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    Membership: {
      id: string;
      userId: string;
      organizationId: string;
      role: string;
      user: {
        id: string;
        imageUrl: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }[];
  };
};
