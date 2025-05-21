import { Request, Response } from "express";
import { techOptions } from "../data/techOptions";

async function handleGetTechOptions(_req: Request, res: Response) {
  res.json(techOptions);
}

export default {
  handleGetTechOptions,
};
