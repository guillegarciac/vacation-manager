// Assuming your file path is /pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let client;
    try {
        const { email, password, username, roleId, accountId } = req.body;

        if (!email || !password || !username || !roleId) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }

        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();

        if (accountId) {
            const accountCollection = db.collection("accounts");
            const account = await accountCollection.findOne({
                _id: new ObjectId(accountId),
            });
            if (!account) {
                res.status(400).json({ message: "Invalid account ID" });
                return;
            }
        } else {
            res.status(400).json({ message: "Account ID is required" });
            return;
        }

        const usersCollection = db.collection("users");
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

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
