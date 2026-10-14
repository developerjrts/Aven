import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is missing from environment variables");
}

export const groq = new OpenAI({
  apiKey,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
  maxRetries: 0,
});
