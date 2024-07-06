"use server";
import { NextResponse } from "next/server";
import connect from "../../../../../database/mongodb";
import User from "../../../../../database/models/User";

export const POST = async (req: any) => {
  try {
    await connect();

    // Assuming you are using Next.js API routes correctly, parse JSON body as follows
    const { username, email, password, roles, account, suspended } = await req.json();

    // Log the entire request body for debugging
    console.log("Received data:", { username, email, password, roles, account, suspended });

    // Check for missing fields
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!roles || roles.length === 0) missingFields.push("roles");
    if (!account) missingFields.push("account");

    // If there are missing fields, log them and return a 400 error
    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields.join(", "));
      return new NextResponse(JSON.stringify({
        message: "Missing required fields: " + missingFields.join(", "),
      }), { status: 400 });
    }

    const newUser = new User({
      username,
      email,
      password,
      roles,
      account,
      suspended: suspended || false
    });

    await newUser.save();
    console.log("User created:", newUser);

    return new NextResponse(JSON.stringify({
      message: "User created successfully",
      data: newUser
    }), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse(JSON.stringify({
      message: "Internal server error",
      error: (error as Error).message
    }), { status: 500 });
  }
};
