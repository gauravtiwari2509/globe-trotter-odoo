import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    // Create a dummy user
    const user = await prisma.user.create({
      data: {
        email: "dummyuser@example.com",
        passwordHash: "hashedpassword123",
        role: "USER",
        verified: true,
      },
    });

    // Create a trip for that user
    const trip = await prisma.trip.create({
      data: {
        ownerId: user.id,
        title: "My Dummy Trip",
        slug: `dummy-trip-${Date.now()}`, // unique slug
        description: "A test trip to showcase Prisma relations",
        status: "DRAFT",
        startDate: new Date("2025-09-01T10:00:00Z"),
        endDate: new Date("2025-09-10T18:00:00Z"),
      },
    });

    // Create some activities for the trip
    const activity1 = await prisma.tripActivity.create({
      data: {
        tripId: trip.id,
        title: "Visit Museum",
        description: "Exploring the local history museum.",
        startTime: new Date("2025-09-02T10:00:00Z"),
        endTime: new Date("2025-09-02T12:00:00Z"),
        durationMin: 120,
        price: 15.0,
      },
    });

    const activity2 = await prisma.tripActivity.create({
      data: {
        tripId: trip.id,
        title: "City Walking Tour",
        description: "Guided walking tour through downtown.",
        startTime: new Date("2025-09-03T14:00:00Z"),
        endTime: new Date("2025-09-03T17:00:00Z"),
        durationMin: 180,
        price: 30.0,
      },
    });

    return NextResponse.json(
      {
        message: "Dummy data created successfully",
        user,
        trip,
        activities: [activity1, activity2],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating dummy data:", error);
    return NextResponse.json(
      { error: "Failed to create dummy data" },
      { status: 500 }
    );
  }
}
