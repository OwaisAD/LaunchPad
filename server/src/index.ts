import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma";

import createServer from "./utils/server";
dotenv.config();

export const app = createServer();
const port = process.env.PORT ?? "9001";

const prisma = new PrismaClient();

async function main() {
  app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
    console.log("Connected to the database");
    console.log("Server started successfully");
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.error("Error starting server:", e);
    process.exit(1);
  });
