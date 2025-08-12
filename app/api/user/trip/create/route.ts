// /api/user/trip/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { createTripSchema } from "@/zodSchemas/tripCreation";
import { prisma } from "@/lib/db/prisma";
import { places } from "@/constants/PlacesData";
import { ActivityType } from "@prisma/client";

// Helper function to generate trip slug (no changes)
function generateTripSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  // Using a shorter timestamp for cleaner slugs
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
}

// Pre-build lookup maps for efficiency (no changes)
const cityDataMap = new Map(places.map((place) => [place.id, place]));
const activityDataMap = new Map();
places.forEach((place) => {
  place.activities.forEach((activity) => {
    activityDataMap.set(activity.id, activity);
  });
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createTripSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      startDate,
      endDate,
      privacy,
      places: tripPlaces,
    } = validationResult.data;

    // --- STEP 1: Seed reference data ---
    for (const place of tripPlaces) {
      const cityData = cityDataMap.get(place.cityId);
      if (!cityData) throw new Error(`City with ID ${place.cityId} not found.`);

      // FIX: Capture the result of the country upsert
      const country = await prisma.country.upsert({
        where: { code: cityData.country.code },
        update: {},
        create: {
          id: cityData.country.id,
          name: cityData.country.name,
          code: cityData.country.code,
          currency: cityData.country.currency,
        },
      });

<<<<<<< HEAD
      for (const rawPlace of places) {
        const place = { ...defaultPlace, ...rawPlace };
=======
      // FIX: Use the ID from the captured country object
      await prisma.city.upsert({
        where: { id: cityData.id },
        update: {},
        create: {
          id: cityData.id,
          name: cityData.name,
          slug: cityData.slug,
          countryId: country.id, // <-- This is the fix!
          lat: cityData.lat,
          lng: cityData.lng,
          costIndex: cityData.costIndex,
          popularity: cityData.popularity,
          meta: cityData.meta as any,
        },
      });
>>>>>>> b2786d4c90cab93437b1a21e6a298eef7174fb7f

      for (const activity of place.activities) {
        const activityData = activityDataMap.get(activity.templateId);
        if (!activityData)
          throw new Error(`Activity with ID ${activity.templateId} not found.`);

        await prisma.activityTemplate.upsert({
          where: { id: activityData.id },
          update: {},
          create: {
            id: activityData.id,
            title: activityData.title,
            description: activityData.description,
            cityId: cityData.id,
            type: activityData.type as ActivityType,
            avgDurationMin: activityData.avgDurationMin,
            price: activityData.price,
            tags: activityData.tags,
            meta: activityData.meta as any,
          },
        });
      }
    }

    // --- STEP 2: Create trip-specific records in a transaction ---
    const newTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          title,
          slug: generateTripSlug(title),
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          privacy,
          status: "DRAFT",
          ownerId: session.user.id,
        },
      });

      for (const place of tripPlaces) {
        const tripStop = await tx.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: place.cityId,
            order: place.order,
            notes: place.notes,
            arrival: place.arrival ? new Date(place.arrival) : null,
            departure: place.departure ? new Date(place.departure) : null,
          },
        });

        for (const activity of place.activities) {
          await tx.tripActivity.create({
            data: {
              tripId: trip.id,
              stopId: tripStop.id,
              templateId: activity.templateId,
              title: activity.title,
              description: activity.description,
              durationMin: activity.durationMin,
              price: activity.price,
              currency: activity.currency,
            },
          });
        }
      }
      return trip;
    });

    return NextResponse.json({
      success: true,
      trip: {
        id: newTrip.id,
        title: newTrip.title,
        slug: newTrip.slug,
        status: newTrip.status,
      },
    });
  } catch (error) {
    console.error("Trip creation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Failed to create trip", details: errorMessage },
      { status: 500 }
    );
  }
}
