import prisma from "../../prisma/client";
// export const getUsers = async () =>
//   await db
//     .select({
//       id: users.id,
//       firstName: users.firstName,
//       lastName: users.lastName,
//       email: users.email,
//     })
//     .from(users);

// export const getUserByEmail = async (email: string) => {
//   const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
//   return user.length > 0 ? user[0] : null;
// };

// export const createUser = async (newUser: NewUser) =>
//   await db.insert(users).values(newUser).returning({
//     id: users.id,
//     firstName: users.firstName,
//     lastName: users.lastName,
//     email: users.email,
//     role: users.role,
//     createdAt: users.createdAt,
//   });

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (newUser: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date | null;
  role?: string;
}) => {
  return await prisma.user.create({
    data: {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    },
  });
};
