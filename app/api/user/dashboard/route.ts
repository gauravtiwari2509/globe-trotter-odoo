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
    const userDashboard = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phoneNo: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            locale: true,
            preferences: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        trips: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            status: true,
            startDate: true,
            endDate: true,
            privacy: true,
            createdAt: true,
            updatedAt: true,
            stops: {
              select: {
                id: true,
                order: true,
                arrival: true,
                departure: true,
                city: {
                  select: {
                    id: true,
                    name: true,
                    country: {
                      select: { id: true, name: true, code: true },
                    },
                  },
                },
              },
            },
            activities: {
              select: {
                id: true,
                title: true,
                description: true,
                startTime: true,
                endTime: true,
                booked: true,
                attendees: true,
                price: true,
                currency: true,
              },
            },
            expenses: {
              select: {
                id: true,
                title: true,
                category: true,
                amount: true,
                currency: true,
                incurredAt: true,
              },
            },
            favorites: {
              select: {
                id: true,
                createdAt: true,
                userId: true,
              },
            },
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                  select: { id: true, profile: { select: { displayName: true } } },
                },
              },
            },
          },
        },
        favorites: {
          select: {
            id: true,
            trip: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            trip: { select: { id: true, title: true, slug: true } },
          },
        },
        media: {
          select: {
            id: true,
            url: true,
            type: true,
            createdAt: true,
          },
        },
      },
    });

    if (!userDashboard) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userDashboard, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
