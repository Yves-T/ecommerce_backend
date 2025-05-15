import prisma from "@/lib/client";
import { compare } from "bcryptjs";
import NextAuth, { User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const email = credentials?.email ?? "";
        const password = (credentials?.password as string) ?? "";
        const user = await prisma.user.findFirst({
          where: { email: { equals: email.toString() } },
        });

        if (!user) return null;

        const passwordOK = await compare(password, user.password);

        if (passwordOK) {
          return {
            id: user?.id,
            email: user?.email,
            // name: user?.name,
            role: user?.admin ? "admin" : "user",
            // image: user?.image,
          } as AuthUser;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }

      if (trigger === "update" && session?.user?.name) {
        token.name = session?.user?.name;
        token.image = session?.user?.image;
      }

      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.userId = token.id as string;
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});
