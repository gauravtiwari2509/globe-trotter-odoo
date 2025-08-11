import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = session.user;

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phoneNo: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            locale: true,
            preferences: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ userProfile }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
