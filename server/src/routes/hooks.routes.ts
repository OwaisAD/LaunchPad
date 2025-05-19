import express from "express";
import hooksController from "../controllers/hooks.controller.";

const HooksRoute = express.Router();

HooksRoute.post("/deploy", hooksController.handleDeployWebhook);

export default HooksRoute;
