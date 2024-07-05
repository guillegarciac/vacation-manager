"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import User from "../../../../database/models/User";

export const GET = async (req: any) => {
  try {
    await connect();
    const users = await User.find();
    const response = {
      message: "Users fetched successfully",
      data: users,
    };
    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
