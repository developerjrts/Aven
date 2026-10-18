import { type Request, type Response } from "express";
import { createNote } from "../service/createai.service.js";

export const createAINote = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({
        error: "Invalid prompt",
      });
    }

    const result = await createNote(prompt.trim());

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI note creation failed:", error);

    return res.status(500).json({
      error: "Failed to create AI note",
    });
  }
};
