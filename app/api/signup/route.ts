import { SignUpInput, signUpSchema } from "@/zodSchemas/signUpSchema";
import { withValidation } from "@/lib/validator/withValidation";
import { handleSignup } from "@/controllers/authController";
export const POST = withValidation<SignUpInput>(signUpSchema, handleSignup);
