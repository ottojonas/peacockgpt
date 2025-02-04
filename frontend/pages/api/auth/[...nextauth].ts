import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import connectToDatabase from "../../../lib/mogoose";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return { id: user._id, email: user.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
