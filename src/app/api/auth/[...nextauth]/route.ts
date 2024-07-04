import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";

declare module "next-auth" {
  interface User {
    role: string;
    accountId?: string;
    userId?: string;
  }

  interface Session {
    user: User;
  }
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!process.env.MONGO_URL) {
          throw new Error("MONGO_URL is not defined");
        }

        const client = new MongoClient(process.env.MONGODB_URI as string);
        await client.connect();

        try {
          const db = client.db();
          const usersCollection = db.collection("users");
          const rolesCollection = db.collection("roles");

          const user = await usersCollection.findOne({
            email: credentials?.email,
          });
          if (!user) {
            return null;
          }

          const passwordCorrect = await compare(
            credentials?.password || "",
            user.password
          );
          if (!passwordCorrect) {
            return null;
          }

          // Fetch the role document using the ObjectId
          const role = await rolesCollection.findOne({
            _id: new ObjectId(user.role),
          });
          if (!role) {
            throw new Error("Role not found");
          }

          // Extract permissions, role level, and userId from the role document
          const userId = user._id.toString();

          // Return user details
          return {
            id: userId,
            email: user.email,
            role: user.role.toString(),
            accountId: user.accountId.toString(),
            userId,
          };
        } finally {
          await client.close();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accountId = user.accountId;
        token.userId = user.userId;
      }
      console.log("JWT token details:", token);
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.role = token.role as string;
      session.user.accountId = token.accountId as string;
      session.user.userId = token.userId as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
