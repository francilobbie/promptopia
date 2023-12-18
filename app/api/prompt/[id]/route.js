import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// GET (read)
export const GET = async (req, res) => {
  try {
    await connectToDB();

    const { id } = req.query;
    const prompt = await Prompt.findById(id).populate("creator", "username");
    if(!prompt) return res.status(404).json({ error: "Prompt not found" });

    res.status(200).json(prompt);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
}

// PATCH (update)
export const PATCH = async (req, res) => {
  try {
    await connectToDB();

    const { id } = req.query;
    const { prompt, tag } = req.body;

    const existingPrompt = await Prompt.findById(id);
    if(!existingPrompt) return res.status(404).json({ error: "Prompt not found" });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    res.status(200).json(existingPrompt);
  } catch (error) {
    res.status(500).json({ error: "Failed to update prompt" });
  }
}

// DELETE (delete)
export const DELETE = async (req, res) => {
  try {
    await connectToDB();

    const { id } = req.query;
    await Prompt.findByIdAndRemove(id);

    res.status(200).json({ message: "Prompt deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete prompt" });
  }
}
