import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { uploadToS3 } from "@/lib/s3-upload/upLoadToS3";
import { withValidation } from "@/lib/validator/withValidation";
import { updateProfileSchema } from "@/zodSchemas/updateProfileSchema";
import z from "zod";

const uploadAvatarSchema = z.object({
  avatar: z.instanceof(File),
});

// PATCH → Update text fields
export const PATCH = withValidation(
  updateProfileSchema,
  async (req: NextRequest, data) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.user;
    if (userId != data.userId) {
      return NextResponse.json(
        { message: "Your are not authorized to change this profile" },
        { status: 203 }
      );
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    // Email update (separate because it's in the User model)
    if (data.email) {
      return NextResponse.json({
        message: "Email update will be available soon",
      });
    }

    // Profile model update
    const profileUpdateData: any = {};
    if (data.displayName !== undefined)
      profileUpdateData.displayName = data.displayName;
    if (data.bio !== undefined) profileUpdateData.bio = data.bio;
    if (data.phoneNo !== undefined) profileUpdateData.phoneNo = data.phoneNo;
    if (data.locale !== undefined) profileUpdateData.locale = data.locale;
    if (data.preferences !== undefined)
      profileUpdateData.preferences = data.preferences;

    await prisma.profile.upsert({
      where: { userId },
      update: profileUpdateData,
      create: { userId, ...profileUpdateData },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  }
);

// POST → avatar upload karne ke liye
export const POST = withValidation(
  uploadAvatarSchema,
  async (req: NextRequest, data) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.user;

    const avatarUrl = await uploadToS3(data.avatar, userId);

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: { userId, avatarUrl },
      select: { avatarUrl: true },
    });

    return NextResponse.json({ avatarUrl: updatedProfile.avatarUrl });
  }
);
