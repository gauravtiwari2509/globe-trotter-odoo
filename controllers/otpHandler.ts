import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OtpInput } from "@/zodSchemas/otpSchema";

export const handleOTPVerification = async (
  req: NextRequest,
  data: OtpInput
) => {
  try {
    const { userId, otp } = data;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json(
        { message: "User is already verified." },
        { status: 200 }
      );
    }

    if (!user.otp || !user.otpExpiresAt || user.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json({ error: "OTP has expired." }, { status: 410 });
    }

    // Mark user as verified and clear OTP
    await prisma.user.update({
      where: { id: userId },
      data: {
        verified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "Account successfully verified." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_OTP_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
