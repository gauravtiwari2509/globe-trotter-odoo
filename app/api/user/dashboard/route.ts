import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = session.user;

  try {
    const [
      totalTrips,
      totalFavorites,
      totalComments,
      totalActivities,
      totalExpenses,
    ] = await Promise.all([
      prisma.trip.count({ where: { ownerId: id } }),
      prisma.favorite.count({ where: { userId: id } }),
      prisma.comment.count({ where: { authorId: id } }),
      prisma.tripActivity.count({ where: { trip: { ownerId: id } } }),
      prisma.expense.count({ where: { trip: { ownerId: id } } }),
    ]);

    const recentTrips = await prisma.trip.findMany({
      where: { ownerId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        stops: {
          select: {
            id: true,
            city: {
              select: {
                name: true,
                country: { select: { name: true, code: true } },
              },
            },
          },
        },
      },
    });

    const recentFavorites = await prisma.favorite.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        trip: { select: { id: true, title: true, slug: true } },
      },
    });

    const preplannedTrips = await prisma.trip.findMany({
      where: {
        ownerId: id,
        startDate: { gte: new Date() }, // upcoming
        status: "PUBLISHED",
      },
      orderBy: { startDate: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
      },
    });

    const previousTrips = await prisma.trip.findMany({
      where: {
        ownerId: id,
        endDate: { lt: new Date() },
      },
      orderBy: { endDate: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json(
      {
        stats: {
          totalTrips,
          totalFavorites,
          totalComments,
          totalActivities,
          totalExpenses,
        },
        recentTrips,
        recentFavorites,
        preplannedTrips,
        previousTrips,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
