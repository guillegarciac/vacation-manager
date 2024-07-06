"use server";
import { NextResponse } from "next/server";
import connect from "../../../../../database/mongodb";
import Squad from "../../../../../database/models/Squad";

export const POST = async (req: any) => {
  try {
    await connect();

    if (req.user.roles.includes('admin')) {
      const newSquad = new Squad(req.body);
      await newSquad.save();
      return new NextResponse(JSON.stringify({ message: "Squad created successfully", data: newSquad }), { status: 201 });
    } else {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }
  } catch (error) {
    console.error("Error creating squad:", error);
    return new NextResponse(JSON.stringify({ message: "Internal server error", error: (error as Error).message }), { status: 500 });
  }
};
