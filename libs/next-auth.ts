import NextAuth, { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getClient } from "./mongo";
import GoogleProvider from "next-auth/providers/google";
import config from "@/config";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name || profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date()
        };
      }
    })
  ],
  adapter: MongoDBAdapter(getClient()),
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  theme: {
    brandColor: config.colors.main,
    logo: `https://${config.domainName}/CryptoAiMemecoins.png`
  }
};

export default NextAuth(authOptions);
