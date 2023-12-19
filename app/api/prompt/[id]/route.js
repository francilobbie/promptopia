import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// GET (read)
export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) {
      const response = new Response("Prompt not found", { status: 404 });
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    const response = new Response(JSON.stringify(prompt), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    const response = new Response("Failed to fetch prompts", { status: 500 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }
};

// PATCH (update)
export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      const response = new Response("Prompt not found", { status: 404 });
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    const response = new Response(JSON.stringify(existingPrompt), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    const response = new Response("Failed to update prompt", { status: 500 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }
};

// DELETE (delete)
export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    await Prompt.findByIdAndRemove(params.id);

    const response = new Response("Prompt deleted", { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    const response = new Response("Failed to delete prompt", { status: 500 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }
};
