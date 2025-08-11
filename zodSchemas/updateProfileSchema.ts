import z from "zod";

export const updateProfileSchema = z.object({
  userId: z.string().min(1),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  phoneNo: z.string().length(10).optional(),
  locale: z.string().optional(),
  preferences: z.string().optional(),
  email: z.string().email().optional(),
});
