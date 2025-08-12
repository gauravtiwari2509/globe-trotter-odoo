import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(req: NextRequest) {
  try {
//      const session = await getServerSession(authOptions);
//     if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
//     const { id } = session.user;
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 5;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers" },
        { status: 400 }
      );
    }

    const trips = await prisma.trip.findMany({
      where: {
        privacy: "public",
        status: "COMPLETED",
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
      include: {
        owner: {
          select: {
            id: true,
          },
        },
        coverMedia: true,
        stops: true,
        activities: true,
        expenses: true,
        favorites: true,
        publicView: true,
        comments: true,
      },
    });

    return NextResponse.json({ success: true, trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
