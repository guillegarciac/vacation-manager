"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Squad from "../../../../database/models/Squad";

export const GET = async (req: any) => {
  try {
    await connect();
    const squads = await Squad.find().populate('members');
    const response = {
      message: "Squads fetched successfully",
      data: squads,
    };
    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
