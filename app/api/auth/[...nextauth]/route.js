import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";
import sendEmail from "@utils/mail";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
        session.user.image = sessionUser.image;
        session.user.description = sessionUser.description;
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          const username = profile.email.split("@")[0].replace(/[^a-zA-Z0-9._]/g, "").substring(0, 20);
          user = await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
            description: "Welcome to your personal profile page."
          });

          const subject = "Welcome to Promptopia!";
          // Text and HTML content for the email
          const text =
            `Hi ${user.username}! Welcome to Promptopia.

            We are thrilled to welcome you to Promptopia, the innovative platform where creativity knows no bounds. At Promptopia, we believe in the power of shared imagination and the wonders it can unfold.

            Here, you can share your unique prompts and gain inspiration from a diverse community of prompt enthusiasts. Whether it's for honing your writing skills, sparking your artistic journey, or just exploring new ideas, Promptopia is the place for you.

            What makes us unique? We harness the power of AI to elevate your experience. This means smarter suggestions, more relevant content, and a community experience tailored to your interests.

            Start exploring now and let the adventure begin! Share your first prompt or dive into the world of inspiring prompts shared by others.

            Remember, every prompt you share helps not just you but others in crafting greater stories and ideas.

            Happy prompting!

            Your friends at Promptopia
            👉[https://promptopia-pi-seven.vercel.app/]
            `;

          const html = `
            <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
              <h1 style="color: #ff5722;">Welcome to Promptopia!</h1>
              <p>Hi ${user.username}! Welcome to Promptopia.</p>
              <p>We are thrilled to welcome you to Promptopia, the innovative platform where creativity knows no bounds. At Promptopia, we believe in the power of shared imagination and the wonders it can unfold.</p>
              <p>Here, you can share your unique prompts and gain inspiration from a diverse community of prompt enthusiasts. Whether it's for honing your writing skills, sparking your artistic journey, or just exploring new ideas, Promptopia is the place for you.</p>
              <p>What makes us unique? We harness the power of AI to elevate your experience. This means smarter suggestions, more relevant content, and a community experience tailored to your interests.</p>
              <p>Start exploring now and let the adventure begin! Share your first prompt or dive into the world of inspiring prompts shared by others.</p>
              <p>Remember, every prompt you share helps not just you but others in crafting greater stories and ideas.</p>
              <p>Happy prompting!</p>
              <p>Your friends at Promptopia</p>
              <a href="https://jade-tartufo-cc767c.netlify.app/" style="display: inline-block; background-color: #ff5722; color: #ffffff; padding: 10px 20px; margin-top: 10px; text-decoration: none; border-radius: 5px;">Start Prompting</a>
            </div>
            `;

          // Asynchronously send the email without awaiting the result
          sendEmail(user.email, subject, text, html)
            .then(() => console.log('Welcome email sent to:', user.email))
            .catch(error => console.error('Error sending welcome email:', error));
        }

        return true; // Sign-in successful
      } catch (error) {
        console.error("Error in signIn callback", error);
        return false; // Deny access on error
      }
    }
  }
});

export { handler as GET, handler as POST };
