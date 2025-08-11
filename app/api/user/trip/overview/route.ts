import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const baseSelect = {
      id: true,
      title: true,
      slug: true,
      status: true,
      startDate: true,
      endDate: true,
      privacy: true,
      createdAt: true,
      updatedAt: true,
      coverMedia: {
        select: {
          url: true,
          altText: true,
        },
      },
    };

    const [upcoming, ongoing, completed, archived] = await Promise.all([
      prisma.trip.findMany({
        where: {
          ownerId: user.id,
          status: "PUBLISHED",
          startDate: { gt: today },
        },
        orderBy: { startDate: "asc" },
        select: baseSelect,
        take: 5,
      }),
      prisma.trip.findMany({
        where: {
          ownerId: user.id,
          status: "PUBLISHED",
          startDate: { lte: today },
          endDate: { gte: today },
        },
        orderBy: { startDate: "asc" },
        select: baseSelect,
        take: 5,
      }),
      prisma.trip.findMany({
        where: {
          ownerId: user.id,
          status: "COMPLETED",
        },
        orderBy: { endDate: "desc" },
        select: baseSelect,
        take: 5,
      }),
      prisma.trip.findMany({
        where: {
          ownerId: user.id,
          status: "ARCHIVED",
        },
        orderBy: { updatedAt: "desc" },
        select: baseSelect,
        take: 5,
      }),
    ]);

    return NextResponse.json({
      upcoming,
      ongoing,
      completed,
      archived,
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
