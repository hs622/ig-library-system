import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Document } from "mongodb";
import dummyUser from "@/dummy-user.json";
import clientPromise from "@/lib/mongodb";

type AuthUserDocument = Document & {
  username: string;
  passwordHash: string;
  firstname?: string;
  lastname?: string;
  image?: string;
  role?: string;
};

type RoleDocument = Document & {
  name?: string;
  role?: string;
  roleName?: string;
};

type PermissionDocument = Document & {
  name?: string;
  role?: string;
  roleName?: string;
  permissions?: string[];
  [key: string]: unknown;
};

async function loadRoleAndPermissions(roleName?: string) {
  if (!roleName) {
    return { role: null, permissions: [] as string[] };
  }

  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);

  const role = await database.collection<RoleDocument>("roles").findOne({
    $or: [{ name: roleName }, { role: roleName }, { roleName }],
  });

  if (!role) {
    return { role: null, permissions: [] as string[] };
  }

  const permissionsCursor = database
    .collection<PermissionDocument>("premissions")
    .find({
      $or: [
        { role: roleName },
        { roleName },
        { name: roleName },
      ],
    });

  const permissions = await permissionsCursor.toArray();
  const flattenedPermissions = permissions
    .flatMap((permission) => {
      const values = permission.permissions ?? [];
      return Array.isArray(values) ? values.map(String) : [];
    })
    .filter(Boolean);

  return {
    role,
    permissions: [...new Set(flattenedPermissions)],
  };
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
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

        if (
          process.env.NODE_ENV === "development" &&
          username === dummyUser.username &&
          password === dummyUser.password
        ) {
          const { role, permissions } = await loadRoleAndPermissions(
            dummyUser.role,
          );

          if (!role) {
            return null;
          }

          return {
            id: `dummy-${dummyUser.username}`,
            name: `${dummyUser.firstname} ${dummyUser.lastname}`,
            username: dummyUser.username,
            firstname: dummyUser.firstname,
            lastname: dummyUser.lastname,
            image: dummyUser.image,
            role: dummyUser.role,
            permissions,
          };
        }

        const client = await clientPromise;
        const database = client.db(process.env.DATABASE_NAME);
        const user = await database
          .collection<AuthUserDocument>("authUsers")
          .findOne(
            { username },
            {
              projection: {
                _id: 1,
                username: 1,
                passwordHash: 1,
                firstname: 1,
                lastname: 1,
                image: 1,
                role: 1,
              },
            },
          );

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
          return null;
        }

        const normalizedRole = user.role?.trim();
        const { role, permissions } = await loadRoleAndPermissions(
          normalizedRole,
        );

        if (!role) {
          return null;
        }

        return {
          id: user._id.toString(),
          name:
            [user.firstname, user.lastname].filter(Boolean).join(" ") ||
            user.username,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          image: user.image,
          role: normalizedRole,
          permissions,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.image = user.image;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.image = token.image ?? null;
        session.user.role = token.role;
        session.user.permissions = token.permissions ?? [];
      }
      return session;
    },
  },
};
