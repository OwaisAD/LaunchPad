import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { loginSchema } from "../validations/loginSchema";
import { getZodErrors } from "../validations/handleZodErrors";
import { ZodError } from "zod";
import { login, logout, registerUser } from "../services/auth.service";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import { registerUserSchema } from "../validations/registerUserSchema";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";

async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password, rememberMe } = req.body;
    const correlationId = req.correlationId;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    loginSchema.parse({ email, password });

    const { sessionToken, sessionTokenExpiry } = await login(email, password, rememberMe, correlationId!);

    // Return the token to the customer via a cookie
    res.cookie(`session`, sessionToken, {
      maxAge: sessionTokenExpiry * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Login successful!" });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = getZodErrors(error);
      const correlationId = req.correlationId;
      logger.warn("Error during customer login", {
        correlationId,
        errorMessages,
      });
      res.status(400).json({ errors: errorMessages });
      return;
    } else if (error instanceof UnauthenticatedError) {
      const correlationId = req.correlationId;
      logger.warn("Invalid credentials", { correlationId, email: req.body.email });
      res.status(401).json({ message: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(401).json({ message: error.message });
      return;
    }
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
}

async function handleRegisterUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    const errors = validateRequiredFields(req.body, ["email", "password", "firstName", "lastName"]);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    registerUserSchema.parse({ email, password, firstName, lastName });

    const newUser = await registerUser({
      email,
      password,
      firstName,
      lastName,
    });

    if (!newUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    res.status(201).json(newUser);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = getZodErrors(error);
      res.status(400).json({ errors: errorMessages });
      return;
    } else if (error instanceof UserAlreadyExistsError) {
      res.status(409).json({ message: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleLogout(req: Request, res: Response) {
  try {
    const sessionToken = req.cookies.session;

    await logout(sessionToken);

    res.clearCookie("session");
    res.status(200).json({ message: "Logged out successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export default {
  handleRegisterUser,
  handleLogin,
  handleLogout,
};
