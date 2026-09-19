import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // <-- Add custom fields here
      username: string | undefined | null;
      email: string | null;
      image: string | null;
      ratings: [];
    };
  }
}
