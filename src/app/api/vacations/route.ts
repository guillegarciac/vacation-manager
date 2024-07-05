"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Vacation from "../../../../database/models/Vacation";

export const GET = async (req: any) => {
  try {
    await connect();

    const queryParams = new URL(req.url).searchParams;
    let filter: Record<string, string> = {};

    queryParams.forEach((value: string, key: string) => {
      filter[key] = value;
    });

    console.log("Fetching vacations with filter:", filter);
    const vacations = await Vacation.find(filter).populate('user');
    console.log("Fetched Vacations:", vacations);
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
