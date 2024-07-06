"use server";
import { NextResponse } from "next/server";
import connect from "../../../../../database/mongodb";
import Squad from "../../../../../database/models/Squad";

export const PUT = async (req: any) => {
  try {
    await connect();

    // Assuming req.user is populated from your authentication middleware
    if (req.user.roles.includes('admin')) {
      const { squadId, userIds } = req.body;
      const updatedSquad = await Squad.findByIdAndUpdate(
        squadId,
        { $addToSet: { members: { $each: userIds } } },
        { new: true }
      );
      
      if (!updatedSquad) {
        return new NextResponse(JSON.stringify({ message: "Squad not found" }), { status: 404 });
      }

      return new NextResponse(JSON.stringify({ message: "Squad updated successfully", data: updatedSquad }), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }
  } catch (error) {
    console.error("Error updating squad:", error);
    return new NextResponse(JSON.stringify({ message: "Internal server error", error: (error as Error).message }), { status: 500 });
  }
};