"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import User from "../../../../database/models/User";
import Squad from "../../../../database/models/Squad";

export const GET = async (req: any) => {
  try {
    await connect();
    const queryParams = new URL(req.url).searchParams;
    const squadId = queryParams.get('squadId');

    if (!squadId) {
      // Fetch all users if no squadId is provided
      const users = await User.find();
      return new NextResponse(JSON.stringify({ message: "Users fetched successfully", data: users }), { status: 200 });
    }

    // Fetch users by squad
    const squad = await Squad.findById(squadId).populate('members');
    if (!squad) {
      return new NextResponse(JSON.stringify({ message: "Squad not found" }), { status: 404 });
    }

    // Assuming 'members' are stored as user references in the Squad model
    const users = await User.find({ _id: { $in: squad.members } });
    return new NextResponse(JSON.stringify({ message: "Users fetched successfully", data: users }), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse(JSON.stringify({ message: "Internal server error", error: (error as Error).message }), { status: 500 });
  }
};
