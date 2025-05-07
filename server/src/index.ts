import dotenv from "dotenv";
import createServer from "./utils/server";
import prisma from "../prisma/client";
import { redisClient } from "./redis/client";

dotenv.config();

export const app = createServer();
const port = process.env.PORT ?? "9001";

async function main() {
  app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
    await redisClient.connect();
    redisClient.on("error", () => console.log("Connection to redis server failed"));
    console.log("Connected to the databases");
    console.log("Server started successfully");
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    await redisClient.quit();
    console.error("Error starting server:", e);
    process.exit(1);
  });
