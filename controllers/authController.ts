import { prisma } from "@/lib/db/prisma";
import { sendOTPEmail } from "@/lib/email/mailer";
import { generateOTP } from "@/lib/email/otp";
import { SignUpInput } from "@/zodSchemas/signUpSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const handleSignup = async (req: NextRequest, data: SignUpInput) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.verified) {
        return NextResponse.json({ error: "User already exists." }, { status: 409 });
      }

      if (existingUser.otpExpiresAt && existingUser.otpExpiresAt > new Date()) {
        return NextResponse.json(
          { error: "Please verify the OTP sent to your email." },
          { status: 409 }
        );
      }

      await prisma.user.delete({ where: { email } });
      return NextResponse.json(
        { message: "OTP expired. Please sign up again." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await prisma.user.create({
      data: { email, passwordHash: hashedPassword, role: "USER", otp, otpExpiresAt },
    });

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "OTP sent successfully", userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
