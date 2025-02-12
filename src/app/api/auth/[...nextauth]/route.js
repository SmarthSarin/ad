import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Import MongoDB connection

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      if (user?.id) session.user.id = user.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth'
  }
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
