import { handleOTPVerification } from "@/controllers/otpHandler";
import { withValidation } from "@/lib/validator/withValidation";
import { OtpInput, otpSchema } from "@/zodSchemas/OtpSchema";
export const POST = withValidation<OtpInput>(otpSchema, handleOTPVerification);
