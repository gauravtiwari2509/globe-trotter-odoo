import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OtpInput } from "@/zodSchemas/otpSchema";

export const handleOTPVerification = async (
  req: NextRequest,
  data: OtpInput
) => {
  try {
    const { userId, otp } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json(
        { message: "User is already verified." },
        { status: 200 }
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      return NextResponse.json(
        { message: "OTP is missing or invalid." },
        { status: 403 }
      );
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 403 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Incorrect OTP. Please try again." },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        verified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "OTP verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_OTP_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
