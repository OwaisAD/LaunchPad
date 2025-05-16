import express from "express";
import techOptionsController from "../controllers/tech-options.controller";

const TechOptionsRoute = express.Router();

TechOptionsRoute.get("/", techOptionsController.handleGetTechOptions);

export default TechOptionsRoute;
