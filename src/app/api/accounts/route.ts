"use server";
import { NextResponse } from "next/server";
import connect from "../../../../database/mongodb";
import Account from "../../../../database/models/Account";

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

    const accounts = await Account.find(filter);
    const response = {
      message: "Accounts fetched successfully",
      data: accounts,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
