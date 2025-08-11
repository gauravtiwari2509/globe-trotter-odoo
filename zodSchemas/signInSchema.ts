import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Must be a valid @gmail.com email"
    ),
  password: z.string().min(1, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;
