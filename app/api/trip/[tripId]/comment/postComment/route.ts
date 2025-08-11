import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      const { id } = session.user;
    try {
        
    } catch (error) {
        
    }
}