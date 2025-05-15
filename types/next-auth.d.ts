import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId: string;
    role: boolean;
  }

  interface User {
    id: string;
    email: string;
    role: string;
  }
}
