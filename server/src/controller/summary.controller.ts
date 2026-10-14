import type { NextFunction, Request, Response } from "express";
import { summarizeNote } from "../service/summary.service.js";

export const createSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content } = req.body;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    content.trim().length === 0 ||
    content.length > 12000 ||
    title.length > 200
  ) {
    return res.status(400).json({
      error: "Invalid note.",
      status: false,
    });
  }

  try {
    const result = await summarizeNote(title, content.trim());

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
