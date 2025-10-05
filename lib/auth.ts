import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // opcional: authorization params extras (prompt, access_type, etc.)
      // authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-ignore: extendemos el tipo en next-auth.d.ts
        session.user.id = user.id;
        // @ts-ignore
        session.user.role = (user as any).role ?? "RESEARCHER";
      }
      return session;
    },
  },
  // pages: { signIn: "/auth/signin" }, // si usas una página custom
  // debug: process.env.NODE_ENV !== "production",
};