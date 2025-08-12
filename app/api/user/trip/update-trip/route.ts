import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
//   const { id } = session.user;
  const id = "6916f99e-4a7a-4a86-b7fa-05dec1f47e93";
  try {
    const body  = await req.json();
    const { tripId, status } = body;

    if (!tripId || !status) {
      return NextResponse.json(
        { error: "tripId and status are required" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED", "COMPLETED"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status value. Allowed: ${allowedStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { ownerId: true },
    });
    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    if (existingTrip.ownerId !== id) {
      return NextResponse.json(
        { error: "You do not have permission to update this trip" },
        { status: 403 }
      );
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: { status },
    });
    return NextResponse.json(
      { 
        success: true, 
        message:"Trip status updated successfully",
        status:updatedTrip.status
       },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trip status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
