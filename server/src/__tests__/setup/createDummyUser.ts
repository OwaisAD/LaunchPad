import prisma from "../../../prisma/client";
import { faker } from "@faker-js/faker";

export async function createDummyUser() {
  await prisma.user.deleteMany({});

  return await prisma.user.create({
    data: {
      id: "testUserId",
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    },
  });
}

export async function createGenericDummyUser() {
  return await prisma.user.create({
    data: {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    },
  });
}

export async function createOrganizationForUser(userId: string) {
  await prisma.organization.deleteMany({});
  await prisma.membership.deleteMany({});

  const slug = faker.lorem.slug();
  return prisma.organization.create({
    data: {
      name: "Test Organization",
      description: "",
      website: "",
      location: "",
      slug,
      owner: { connect: { id: userId } },
      Membership: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
  });
}
