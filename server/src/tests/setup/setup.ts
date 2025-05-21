import prisma from "../../../prisma/client";
import createServer from "../../utils/server";
// import { redisClient } from "../../redis/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let app: any;

global.beforeAll(async () => {
  app = createServer();

  // if (!redisClient.isOpen) {
  //   await redisClient.connect();
  // }
  // redisClient.on("error", () => console.log("Connection to redis server failed"));
});

global.beforeEach(async () => {
  // clear database from all tables
  await prisma.$transaction([
    prisma.membership.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.project.deleteMany(),
    prisma.organization.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

global.afterAll(async () => {
  console.log("Disconnecting from Prisma...");
  await prisma.$disconnect();
  console.log("Prisma disconnected.");

  // console.log("Quitting Redis client...");
  // await redisClient.quit();
  // console.log("Redis client quit.");
});
