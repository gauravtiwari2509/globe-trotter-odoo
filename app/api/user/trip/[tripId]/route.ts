import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const userId = session.user.id;

    const userId = "ca7d21a9-1899-4c49-968f-c58b9303c53f"

    const url = new URL(req.url);
    console.log("URL:",url);
    const tripId = url.pathname.split("/").pop();

    if (!tripId) {
      return NextResponse.json({ message: "Trip ID is required" }, { status: 400 });
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        ownerId: userId,
      },
      include: {
        coverMedia: true,
        stops: { orderBy: { order: "asc" } },
        activities: { orderBy: { startTime: "asc" } },
        expenses: true,
        favorites: true,
        publicView: true,
        comments: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ message: "Trip not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
