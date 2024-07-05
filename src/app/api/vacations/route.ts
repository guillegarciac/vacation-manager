"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Vacation from "../../../../database/models/Vacation";

export const GET = async (req: any) => {
  try {
    await connect();
    const vacations = await Vacation.find().populate('user');
    const response = {
      message: "Vacations fetched successfully",
      data: vacations,
    };
    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching vacations:", error);
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
