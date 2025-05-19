import fs from "fs-extra";

export async function cleanUpProjectFolder(location: string) {
  try {
    await fs.remove(location);
    console.log(`Successfully removed project folder at ${location}`);
  } catch (error) {
    console.error(`Error removing project folder at ${location}:`, error);
  }
}
