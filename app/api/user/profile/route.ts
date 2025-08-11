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
        trips: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            status: true,
            startDate: true,
            endDate: true,
            createdAt: true,
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

    // Separate trips by status
    const preplannedTrips = userProfile.trips.filter(trip =>
      ["DRAFT", "PUBLISHED"].includes(trip.status)
    );

    const previousTrips = userProfile.trips.filter(
      trip => trip.status === "COMPLETED"
    );

    // Remove `trips` from main profile before returning
    const { trips, ...profileData } = userProfile;

    return NextResponse.json(
      { userProfile: profileData, preplannedTrips, previousTrips },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
