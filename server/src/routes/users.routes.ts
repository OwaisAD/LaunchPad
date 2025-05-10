import express from "express";
import usersController from "../controllers/users.controller";

const UsersRouter = express.Router();

UsersRouter.post("/webhook", express.raw({ type: "application/json" }), usersController.handleClerkWebhook);

export default UsersRouter;
