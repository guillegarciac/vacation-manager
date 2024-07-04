"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Sprint from "../../../../database/models/Sprint";

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

    const sprints = await Sprint.find(filter).populate('squads');
    const response = {
      message: "Sprints fetched successfully",
      data: sprints,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
