import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      //Create new user
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user.name!,
            email: user.email!,
            image: user.image!,
          },
        });
      }
      return true;
    },
    async session({ session, user, token }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      });
      if (dbUser) {
        (session.user as any).id = dbUser.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
