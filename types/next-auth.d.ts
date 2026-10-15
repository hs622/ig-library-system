import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      firstname?: string;
      lastname?: string;
      image?: string | null;
      role?: string;
      permissions?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    firstname?: string;
    lastname?: string;
    image?: string | null;
    role?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    firstname?: string;
    lastname?: string;
    image?: string | null;
    role?: string;
    permissions?: string[];
  }
}
