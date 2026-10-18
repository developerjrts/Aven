import { url } from "@/constants/urls";

export type AINoteResult = {
  title: string;
  content: string;
};

export async function createAINote(prompt: string): Promise<AINoteResult> {
  const text = prompt.trim();

  if (!text) {
    throw new Error("Please enter a prompt.");
  }

  if (text.length > 4000) {
    throw new Error("Prompts must be 4,000 characters or fewer.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${url}/askai/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: text }),
      signal: controller.signal,
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : "Unable to create a note.";

      throw new Error(message);
    }

    if (
      typeof data !== "object" ||
      data === null ||
      !("title" in data) ||
      typeof data.title !== "string" ||
      !("content" in data) ||
      typeof data.content !== "string"
    ) {
      throw new Error("The AI returned an invalid response.");
    }

    return {
      title: data.title,
      content: data.content,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
