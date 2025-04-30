import dotenv from "dotenv";

import createServer from "./utils/server";
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
    console.log("Server started successfully");
  })
  .catch(async (e) => {
    console.error("Error starting server:", e);
    process.exit(1);
  });
