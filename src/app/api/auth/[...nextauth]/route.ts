import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";

declare module "next-auth" {
  interface User {
    account?: string;
    user?: string;
    roles?: string[];
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
        if (!process.env.MONGODB_URI) {
          throw new Error("MONGODB_URI is not defined");
        }

        const client = new MongoClient(process.env.MONGODB_URI as string);
        await client.connect();

        try {
          const db = client.db();
          const usersCollection = db.collection("users");

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

          // Return user details
          return {
            id: user._id.toString(),
            email: user.email,
            account: user.account.toString(),
            user: user.username,
            roles: user.roles,
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
        token.account = user.account;
        token.user = user.user;
        token.roles = user.roles;
      }
      console.log("JWT token details:", token);
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.account = token.account as string;
      session.user.user = token.user as string;
      session.user.roles = token.roles as string[];
      return session;
    },
  },
});

export { handler as GET, handler as POST };
