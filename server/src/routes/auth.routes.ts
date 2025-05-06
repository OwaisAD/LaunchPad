import express, { Request, Response } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import authController from "../controllers/auth.controller";

const AuthRouter = express.Router();

AuthRouter.post("/validate", isAuthenticated);

AuthRouter.post("/login", authController.handleLogin);
AuthRouter.post("/register", authController.handleRegisterUser);
AuthRouter.post("/logout", isAuthenticated, authController.handleLogout);

// forgot password
AuthRouter.post("/forgotpassword", (req: Request, res: Response) => {
  res.status(501).send("Not implemented");
});

export default AuthRouter;
