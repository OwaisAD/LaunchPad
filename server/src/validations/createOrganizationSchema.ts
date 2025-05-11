import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(300).optional(),
  website: z.string().optional(),
  location: z.string().max(100).optional(),
});
