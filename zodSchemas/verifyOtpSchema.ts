import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
