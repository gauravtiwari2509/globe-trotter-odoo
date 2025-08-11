import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .regex(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Must be a valid @gmail.com email"
      ),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "At least one lowercase letter required")
      .regex(/[A-Z]/, "At least one uppercase letter required")
      .regex(/[0-9]/, "At least one digit required")
      .regex(/[^a-zA-Z0-9]/, "At least one special character required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
