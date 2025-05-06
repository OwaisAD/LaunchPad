import { passwordRegex } from "../utils/regex";
import { z } from "zod";

const registerUserSchema = z.object({
  firstName: z.string().min(1, "Please enter a valid first name"),
  lastName: z.string().min(1, "Please enter a valid last name"),
  dateOfBirth: z.string().refine(
    (date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      return age > 18 || (age === 18 && monthDiff >= 0);
    },
    {
      message: "You must be at least 18 years old",
    }
  ),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!, @, #, $, %, ^, &, *, -, +, =)"
    ),
});

export { registerUserSchema };
