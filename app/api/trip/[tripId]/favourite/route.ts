import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { tripId: string } }
) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const userId = session.user.id;
    const userId = "6916f99e-4a7a-4a86-b7fa-05dec1f47e93"
  const { tripId } = params; 
  try {
    if (!tripId) {
      return NextResponse.json(
        { error: "tripId is required to add the trip to favourites" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true },
    });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_tripId: {
          userId,
          tripId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Trip already in favorites" },
        { status: 200 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        tripId,
      },
    });

    return NextResponse.json({ success: true, favorite }, { status: 201 });
  } catch (error) {
    console.error("Error adding trip to favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
