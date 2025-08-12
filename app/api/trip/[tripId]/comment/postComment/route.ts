import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest,{params}:{ params:{ tripId: string }}) {

//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
//   const userId = session.user.id;
    const userId = "d53789f1-8a3f-4313-ae2c-8bd6b18edacc";

  try {
    const { tripId } = params; 
    const { content, activityId } = await req.json();

    if (!tripId || typeof tripId !== "string") {
      return NextResponse.json({ error: "tripId is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const tripExists = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true },
    });
    if (!tripExists) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (activityId) {
      const activity = await prisma.tripActivity.findUnique({
        where: { id: activityId },
      });
      if (!activity) {
        return NextResponse.json({ error: "Activity not found" }, { status: 404 });
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        authorId: userId,
        tripId,
        content,
        activityId: activityId ?? null,
      },
    });

    return NextResponse.json(
        { success: true, 
          message:'Successfully added the comment on the trip',
          comment:newComment.content
        }, 
        { status: 201 });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
