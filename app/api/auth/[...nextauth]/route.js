import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
        session.user.image = sessionUser.image; // Add this line
        session.user.description = sessionUser.description; // Add this line
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // Create a username that adheres to your schema's requirements
          const username = profile.email.split("@")[0].replace(/[^a-zA-Z0-9._]/g, "").substring(0, 20);
          user = await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
            description: "Welcome to your personal profile page." // Only if you want a different default
          });
        }

        // Additional checks or operations can be done here

        return true; // Sign-in successful
      } catch (error) {
        console.error("Error in signIn callback", error);
        // Handle specific errors differently if needed
        return false; // Deny access on error
      }
    }
  }
});

export { handler as GET, handler as POST };
