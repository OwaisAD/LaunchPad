import express, { Request, Response } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import authController from "../controllers/auth.controller";

const AuthRouter = express.Router();

AuthRouter.post("/validate", isAuthenticated, (req: Request, res: Response) => {
  res.status(200).json({
    message: "User is authenticated",
    userId: req.userId,
    email: req.email,
  });
  return;
});

AuthRouter.post("/login", authController.handleLogin);
AuthRouter.post("/register", authController.handleRegisterUser);
AuthRouter.post("/logout", isAuthenticated, authController.handleLogout);

// forgot password
AuthRouter.post("/forgotpassword", (req: Request, res: Response) => {
  res.status(501).send("Not implemented");
  return;
});

export default AuthRouter;
