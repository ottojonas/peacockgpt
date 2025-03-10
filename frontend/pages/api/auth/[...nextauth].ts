import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../lib/mongoose";
import User from "../../../models/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (
          user &&
          (await argon2.verify(user.password, credentials.password))
        ) {
          const accessToken = jwt.sign(
            { id: user._id, email: user.email, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
          );
          return {
            id: user._id as string,
            email: user.email,
            admin: user.admin,
            accessToken,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          id: token.id,
          admin: token.admin as boolean,
          email: token.email,
        };
        session.accessToken = token.accessToken;
      } else {
        console.warn("Token is null, returning empty session object");
        return {};
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.admin = user.admin;
        token.accessToken = user.accessToken;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
