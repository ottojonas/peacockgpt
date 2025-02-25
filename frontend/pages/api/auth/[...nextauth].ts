import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../lib/mongoose";
import User from "../../../models/User";
import argon2 from "argon2";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (
          user &&
          (await argon2.verify(user.password, credentials.password))
        ) {
          return { id: user._id, email: user.email, admin: user.admin };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.admin = token.admin as string;
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.admin = user.admin;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
