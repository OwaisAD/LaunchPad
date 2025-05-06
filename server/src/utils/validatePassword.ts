import bcrypt from "bcrypt";

export async function validatePassword(password: string, hashedPassword: string) {
  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }
}
