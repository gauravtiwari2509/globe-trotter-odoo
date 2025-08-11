import { prisma } from "@/lib/db/prisma";
import { sendOTPEmail } from "@/lib/email/mailer";
import { generateOTP } from "@/lib/email/otp";
import { SignUpInput } from "@/zodSchemas/signUpSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const handleSignup = async (req: NextRequest, data: SignUpInput) => {
  try {
    let { displayName, phoneNo, email, password } = data;

    email = email.toLowerCase();

    if (!displayName || !phoneNo || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user with this email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (existingUser) {
      if (existingUser.verified) {
        return NextResponse.json(
          { message: "You already have an account. Please sign in." },
          { status: 200 }
        );
      }

      if (existingUser.otpExpiresAt && existingUser.otpExpiresAt > new Date()) {
        return NextResponse.json(
          {
            message: "OTP already sent. Please check your inbox.",
            userId: existingUser.id,
          },
          { status: 200 }
        );
      }

      // OTP expired, resend new one
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
          { message: "Failed to resend OTP email. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          message: "Previous OTP expired. New OTP sent.",
          userId: existingUser.id,
        },
        { status: 200 }
      );
    }

    // Create new user and profile
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

      await prisma.$transaction([
        prisma.profile.deleteMany({ where: { userId: user.id } }),
        prisma.user.delete({ where: { id: user.id } }),
      ]);

      return NextResponse.json(
        { message: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Account created. OTP sent to your email.", userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
