declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string | undefined | null;
      email: string | null;
      image: string | null;
      ratings: [];
    };
  }
}
