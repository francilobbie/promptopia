// File: app/api/users/[id]/route.js

import { connectToDB } from '@utils/database';
import User from '@models/user';
import Prompt from '@models/prompt'; // Import the Prompt model
import sendEmail from "@utils/mail";


// GET - Fetch user details
export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.id);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch user", error }), { status: 500 });
  }
};


// DELETE - Delete user
export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.id);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Delete all prompts created by the user
    await Prompt.deleteMany({ creator: user._id });

    // Delete user
    await User.findByIdAndDelete(params.id);

    const subject = "Goodbye from Promptopia - We're Sad to See You Go!";
          const text =
            `Dear ${user.username},

            It's with a heavy heart that we say goodbye. We noticed you've deleted your account at Promptopia, and while we're sad to see you leave, we respect your decision.

            We hope that your time with us was filled with creativity, inspiration, and countless prompts that sparked your imagination. Your contribution to our community of prompt enthusiasts was invaluable, and you will be missed.

            If you ever decide to return, remember that our doors are always open, and a world of prompts awaits your exploration.

            Should you have any feedback or thoughts you'd like to share about your experience, we're all ears. Your insights help us grow and improve.

            Wishing you all the best in your future creative endeavors!

            Farewell and take care,

            The Promptopia Team
            [https://promptopia-pi-seven.vercel.app/]
            `;

            const html = `
            <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
              <h1 style="color: #ff5722;">Goodbye from Promptopia - We're Sad to See You Go!</h1>
              <p>Dear ${user.username},</p>
              <p>It's with a heavy heart that we say goodbye. We noticed you've deleted your account at Promptopia, and while we're sad to see you leave, we respect your decision.</p>
              <p>We hope that your time with us was filled with creativity, inspiration, and countless prompts that sparked your imagination. Your contribution to our community of prompt enthusiasts was invaluable, and you will be missed.</p>
              <p>If you ever decide to return, remember that our doors are always open, and a world of prompts awaits your exploration.</p>
              <p>Should you have any feedback or thoughts you'd like to share about your experience, we're all ears. Your insights help us grow and improve.</p>
              <p>Wishing you all the best in your future creative endeavors!</p>
              <p>Farewell and take care,</p>
              <p>The Promptopia Team</p>
              <a href="https://jade-tartufo-cc767c.netlify.app/" style="display: inline-block; background-color: #ff5722; color: #ffffff; padding: 10px 20px; margin-top: 10px; text-decoration: none; border-radius: 5px;">Visit Promptopia</a>
            </div>
            `;



          try {
            await sendEmail(user.email, subject, text, html);
            console.log('Good by email sent to:', user.email);
          } catch (error) {
            console.error('Error sending Good by email:', error);
            // Decide how to handle the error. E.g., Log it, or even retry sending.
          }

    return new Response(JSON.stringify({ message: "User and their prompts deleted" }), { status: 200 });
  } catch (error) {
    console.error("DELETE user error:", error); // Detailed error logging
    return new Response(JSON.stringify({ message: "Failed to delete user and their prompts", error: error.message }), { status: 500 });
  }
};
