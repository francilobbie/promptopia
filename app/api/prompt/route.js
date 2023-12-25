import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async () => {
  try {
    await connectToDB();
    const prompts = await Prompt.find({}).populate("creator");

    const response = new Response(JSON.stringify(prompts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Only use s-maxage and stale-while-revalidate for caching control
        'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch prompts" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
