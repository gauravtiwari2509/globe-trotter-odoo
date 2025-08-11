import { z } from "zod";

export const otpSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export type OtpInput = z.infer<typeof otpSchema>;
