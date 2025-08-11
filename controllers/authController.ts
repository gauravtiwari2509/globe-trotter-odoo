import { prisma } from "@/lib/db/prisma";
import { sendOTPEmail } from "@/lib/email/mailer";
import { generateOTP } from "@/lib/email/otp";
import { SignUpInput } from "@/zodSchemas/signUpSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const handleSignup = async (req: NextRequest, data: SignUpInput) => {
  try {
    const { displayName, phoneNo, email, password } = data;

    
    if (!displayName || !phoneNo || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // --- Check if email is already in use ---
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (existingUser) {
      if (existingUser.verified) {
        return NextResponse.json(
          { error: "User already exists." },
          { status: 409 }
        );
      }

      // If still valid OTP, just ask them to verify
      if (existingUser.otpExpiresAt && existingUser.otpExpiresAt > new Date()) {
        return NextResponse.json(
          { error: "Please verify the OTP sent to your email." },
          { status: 409 }
        );
      }

      // OTP expired — regenerate & resend
      const newOtp = generateOTP();
      const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          otp: newOtp,
          otpExpiresAt: newExpiry,
        },
      });

      try {
        await sendOTPEmail(email, newOtp);
      } catch (emailError) {
        console.error("Error resending OTP email:", emailError);
        return NextResponse.json(
          { error: "Failed to resend OTP email. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "OTP expired. A new OTP has been sent to your email." },
        { status: 200 }
      );
    }

    // --- Create new user ---
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: "USER",
        otp,
        otpExpiresAt,
        profile: {
          create: {
            displayName,
            phoneNo,
          },
        },
      },
    });

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      // If sending OTP fails for a new user, delete both profile & user
      await prisma.$transaction([
        prisma.profile.deleteMany({ where: { userId: user.id } }),
        prisma.user.delete({ where: { id: user.id } }),
      ]);

      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully", userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
