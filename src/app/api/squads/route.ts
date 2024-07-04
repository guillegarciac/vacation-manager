"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Squad from "../../../../database/models/Squad";

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

    const squads = await Squad.find(filter).populate('members');
    const response = {
      message: "Squads fetched successfully",
      data: squads,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
