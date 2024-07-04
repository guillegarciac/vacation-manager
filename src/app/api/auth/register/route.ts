import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import { MongoClient, ObjectId } from 'mongodb';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  let client;

  try {
    const { email, password, username, roleId, accountId } = req.body;

    // Validate required fields
    if (!email || !password || !username || !roleId || !accountId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    // Connect to the MongoDB client
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();

    // Validate account ID
    const accountCollection = db.collection("accounts");
    const account = await accountCollection.findOne({ _id: new ObjectId(accountId) });
    if (!account) {
      res.status(400).json({ message: "Invalid account ID" });
      return;
    }

    // Check if the user already exists
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password and create the new user
    const hashedPassword = await hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      username,
      role: new ObjectId(roleId),
      accountId: new ObjectId(accountId),
    };

    const insertResult = await usersCollection.insertOne(newUser);
    if (insertResult.insertedId) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(500).json({ message: "User registration failed" });
    }
  } catch (e) {
    console.error("Error in POST request:", e);
    res.status(500).json({ message: "An error occurred" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
