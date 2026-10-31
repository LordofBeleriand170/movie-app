import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { username, password } = credentials ?? {};

        if (!username || !password) return null;

        const user = await prisma.user.findUnique({
          where: { name: username },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        if (
          !user.isVerified &&
          ((user.verificationTokenExpiresAt &&
            user.verificationTokenExpiresAt < new Date()) ||
            !user.verificationTokenExpiresAt)
        ) {
          const verificationToken = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          const verificationTokenExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000,
          );

          await prisma.user.update({
            where: { id: user.id },
            data: {
              verificationToken: verificationToken,
              verificationTokenExpiresAt: verificationTokenExpiresAt,
            },
          });

          throw new Error(
            "Verification code expired and new code has been sent",
          );
        } else if (!user.isVerified) {
          throw new Error("User not verified");
        }

        return {
          id: user?.id,
          email: user?.email,
          role: user?.role,
          username: user?.name,
          createdAt: user?.createdAt,
          image: user?.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/verify",
  },

  callbacks: {
    async session({ session, token }) {
      console.log("TOKEN: ", token);
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          username: token.name,
          role: token.role,
          createdAt: token?.createdAt,
          image: token?.image,
        };
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
        });

        console.log("dbUser: ", dbUser);

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.username = dbUser.name;
          token.role = dbUser.role;
          token.createdAt = dbUser.createdAt;
        }
      }

      return token;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (
          existingUser &&
          existingUser.password &&
          !existingUser.isGoogleUser
        ) {
          throw new Error("account_link_conflict");
        }
      }
      return true;
    },

    async redirect({ baseUrl, url }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
