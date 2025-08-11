import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = session.user;
  try {
    const data = await req.json();

    const {
      title,
      slug,
      description,
      status,
      startDate,
      endDate,
      privacy,
      coverMediaId,
      stops,
      activities,
      expenses,
    } = data;

    if ( !title || !slug) {
      return NextResponse.json(
        { message: " title, and slug are required" },
        { status: 400 }
      );
    }

    // Create trip with nested related data if provided
    const newTrip = await prisma.trip.create({
      data: {
        ownerId:id,
        title,
        slug,
        description,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        privacy: privacy ?? "private",
        coverMediaId,

        stops: stops
          ? {
              create: stops.map((stop: any) => ({
                cityId: stop.cityId,
                order: stop.order,
                arrival: stop.arrival ? new Date(stop.arrival) : undefined,
                departure: stop.departure ? new Date(stop.departure) : undefined,
                notes: stop.notes,
                meta: stop.meta,
              })),
            }
          : undefined,

        activities: activities
          ? {
              create: activities.map((activity: any) => ({
                title: activity.title,
                description: activity.description,
                startTime: activity.startTime ? new Date(activity.startTime) : undefined,
                endTime: activity.endTime ? new Date(activity.endTime) : undefined,
                durationMin: activity.durationMin,
                price: activity.price,
                currency: activity.currency ?? "USD",
                booked: activity.booked ?? false,
                attendees: activity.attendees ?? 1,
                meta: activity.meta,
              })),
            }
          : undefined,

        expenses: expenses
          ? {
              create: expenses.map((expense: any) => ({
                title: expense.title,
                category: expense.category,
                amount: expense.amount,
                currency: expense.currency ?? "USD",
                incurredAt: expense.incurredAt ? new Date(expense.incurredAt) : undefined,
                vendor: expense.vendor,
                notes: expense.notes,
                meta: expense.meta,
              })),
            }
          : undefined,
      },
      include: {
        stops: true,
        activities: true,
        expenses: true,
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
