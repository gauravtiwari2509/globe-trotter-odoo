import { z } from "zod";

export const signUpSchema = z
  .object({
    displayName: z
      .string()
      .min(3, "Full Name must be at least 3 characters long.")
      .max(50, "Full Name must not exceed 50 characters."),

    phoneNo: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits."),

    email: z
      .string()
      .email("Please enter a valid email address.")
      .regex(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Email must be a valid @gmail.com address."
      ),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
