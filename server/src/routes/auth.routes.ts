import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import authController from "../controllers/auth.controller";

const AuthRouter = express.Router();

AuthRouter.get("/validate", isAuthenticated);

AuthRouter.post("/signin", authController.handleLogin);
AuthRouter.post("/refresh", authController.handleRefreshToken);
AuthRouter.post("/signup", authController.handleRegisterUser);
AuthRouter.post("/signout", authController.handleLogout);
AuthRouter.get("/protected", authController.protectedRoute);

export default AuthRouter;
