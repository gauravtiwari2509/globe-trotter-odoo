import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { createTripSchema } from "@/zodSchemas/tripCreation";
import { Prisma } from "@prisma/client";

function parseDateOrNull(val: any): Date | null {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function ensureUniqueSlug(
  base: string,
  finder: (slug: string) => Promise<any>
) {
  let slug = base;
  let counter = 0;
  while (await finder(slug)) {
    counter++;
    slug = `${base}-${counter}`;
  }
  return slug;
}

const defaultPlace = {
  name: "New Delhi",
  slug: "new-delhi",
  lat: 28.6139,
  lng: 77.209,
  costIndex: 60.5,
  popularity: 95,
  meta: {
    theme: "Historical & Political Hub",
    description:
      "The capital of India, known for its rich history, iconic landmarks, and vibrant culture.",
    best_time_to_visit: "October to March",
  },
  country: {
    name: "India",
    code: "IN",
    currency: "INR",
  },
  activities: [
    {
      title: "Explore India Gate",
      description: "A war memorial and an iconic symbol of New Delhi.",
      durationMin: 60,
      price: 0,
      currency: "INR",
      meta: {
        traveler_tips:
          "Visit during the evening when it is beautifully lit up.",
      },
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    const body = await request.json();
    const validation = createTripSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.errors.map(
            (e) => `${e.path.join(".")}: ${e.message}`
          ),
        },
        { status: 400 }
      );
    }

    const payload = validation.data;
    const { title, description, startDate, endDate, privacy, places } = payload;

    const start = parseDateOrNull(startDate);
    const end = parseDateOrNull(endDate);

    const defaultCountry = await prisma.country.upsert({
      where: { code: "UNK" },
      update: {},
      create: { name: "Unknown Country", code: "UNK", currency: "USD" },
    });

    const createdTrip = await prisma.$transaction(async (tx) => {
      const tripSlug = await ensureUniqueSlug(slugify(title), (slug) =>
        tx.trip.findUnique({ where: { slug } })
      );

      const newTrip = await tx.trip.create({
        data: {
          ownerId: userId,
          title,
          slug: tripSlug,
          description,
          startDate: start,
          endDate: end,
          privacy: privacy ?? "private",
          status: "DRAFT",
        },
      });

      for (const rawPlace of places) {
        const place = { ...defaultPlace, ...rawPlace };

        let country = await tx.country.findUnique({
          where: { code: place.country?.code },
        });
        if (!country) {
          country = await tx.country.create({
            data: {
              name: place.country?.name ?? "Unknown",
              code: place.country?.code ?? "UNK",
              currency: place.country?.currency ?? "USD",
            },
          });
        }

        let city = await tx.city.findFirst({
          where: { name: place.name, countryId: country.id },
          select: { id: true },
        });

        if (!city) {
          const uniqueCitySlug = await ensureUniqueSlug(
            slugify(place.name),
            (slug) => tx.city.findUnique({ where: { slug } })
          );
          const createdCity = await tx.city.create({
            data: {
              name: place.name,
              slug: uniqueCitySlug,
              country: { connect: { id: country.id } },
              lat: place.lat,
              lng: place.lng,
              costIndex: place.costIndex,
              popularity: place.popularity,
              meta: place.meta ?? {},
            },
          });
          city = { id: createdCity.id };
        }

        const tripStop = await tx.tripStop.create({
          data: {
            tripId: newTrip.id,
            cityId: city.id,
            order: typeof place.order === "number" ? place.order : 0,
            arrival: parseDateOrNull(place.arrival) ?? start,
            departure: parseDateOrNull(place.departure) ?? end,
            notes: place.notes ?? null,
            meta: place.meta ?? {},
          },
        });

        if (Array.isArray(place.activities)) {
          for (const rawActivity of place.activities) {
            const activity = { ...defaultPlace.activities[0], ...rawActivity };
            let templateId: string | null = null;

            if (activity.templateId) {
              const template = await tx.activityTemplate.findUnique({
                where: { id: activity.templateId },
                select: { id: true },
              });
              if (template) templateId = template.id;
            }

            await tx.tripActivity.create({
              data: {
                tripId: newTrip.id,
                stopId: tripStop.id,
                templateId,
                title: activity.title,
                description: activity.description ?? null,
                durationMin: activity.durationMin ?? null,
                price: activity.price ?? 0,
                currency: activity.currency ?? country.currency,
                startTime: parseDateOrNull(activity.startTime),
                endTime: parseDateOrNull(activity.endTime),
                booked: false,
                meta: activity.meta ?? {},
              },
            });
          }
        }
      }

      return newTrip;
    });

    return NextResponse.json({
      success: true,
      trip: {
        id: createdTrip.id,
        title: createdTrip.title,
        slug: createdTrip.slug,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
