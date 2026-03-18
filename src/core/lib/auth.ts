import { Role } from "@/features/auth/types";
import { loginSchema } from "@/features/auth/validations";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import LineProvider from "next-auth/providers/line";
import { api } from "./api-client";

type ApiLoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  };
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "user-credentials",
      name: "user-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);

        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;

        try {
          const response = await api.post<ApiLoginResponse>("auth/login", {
            email,
            password,
          });

          if (!response || !response.user || !response.accessToken) {
            return null;
          }

          return {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            image: undefined,
            accessToken: response.accessToken,
            role: response.user.role,
          };
        } catch (error) {
          console.error("API auth login error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "admin-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);

        if (!validated.success) return null;

        const { email, password } = validated.data;

        try {
          const response = await api.post<ApiLoginResponse>(
            "admin/auth/login",
            {
              email,
              password,
            }
          );

          if (!response?.user || !response?.accessToken) return null;

          return {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            accessToken: response.accessToken,
            role: response.user.role,
          };
        } catch (error) {
          console.error("Admin login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if ("accessToken" in user)
          token.accessToken = (user as User).accessToken;
        if ("role" in user) token.role = (user as User).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.accessToken)
          session.user.accessToken = token.accessToken as string;
        if (token.role) session.user.role = token.role as Role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
