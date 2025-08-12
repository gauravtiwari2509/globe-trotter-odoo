// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth/authOptions";

// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") ?? "1", 10);
//     const limit = parseInt(searchParams.get("limit") ?? "10", 10);

//     if (page < 1 || limit < 1) {
//       return NextResponse.json(
//         { message: "Page and limit must be positive integers" },
//         { status: 400 }
//       );
//     }

//     const skip = (page - 1) * limit;

//     const trips = await prisma.trip.findMany({
//       where: { ownerId: userId },
//       orderBy: { createdAt: "desc" },
//       skip,
//       take: limit,
//       include: {
//         coverMedia: true,
//         stops: { orderBy: { order: "asc" } },
//         activities: { orderBy: { startTime: "asc" } },
//         expenses: true,
//         favorites: true,
//       },
//     });

//     const totalTrips = await prisma.trip.count({ where: { ownerId: userId } });

//     return NextResponse.json({
//       page,
//       limit,
//       total: totalTrips,
//       trips,
//     });
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// /api/user/trip/get-all/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: "Page and limit must be positive integers" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const trips = await prisma.trip.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        coverMedia: true,
        // FIX: Include the related City model for each stop
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: {
              select: {
                name: true,
              },
            },
          },
        },
        activities: { orderBy: { startTime: "asc" } },
        expenses: true,
        favorites: true,
      },
    });

    const totalTrips = await prisma.trip.count({ where: { ownerId: userId } });

    return NextResponse.json({
      page,
      limit,
      total: totalTrips,
      trips,
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
