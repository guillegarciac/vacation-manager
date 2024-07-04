"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Vacation from "../../../../database/models/Vacation";

export const GET = async (req: any) => {
  try {
    await connect();

    const queryParams = req.url.searchParams;
    let filter: Record<string, string> = {};

    if (queryParams) {
      queryParams.forEach((value: string, key: string) => {
        filter[key] = value;
      });
    }

    const vacations = await Vacation.find(filter).populate('user');
    const response = {
      message: "Vacations fetched successfully",
      data: vacations,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
