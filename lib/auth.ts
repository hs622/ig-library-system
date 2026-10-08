import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Document } from "mongodb";
import clientPromise from "@/lib/mongodb";

type AuthUserDocument = Document & {
  username: string;
  passwordHash: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Username and password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const client = await clientPromise;
        const database = client.db(process.env.DATABASE_NAME);
        const user = await database
          .collection<AuthUserDocument>("authUsers")
          .findOne(
            { username },
            { projection: { _id: 1, username: 1, passwordHash: 1 } },
          );

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.username,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
