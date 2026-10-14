import { url } from "@/constants/urls";

export type SummaryResult = {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
};

export async function summarizeNote(
  title: string,
  content: string,
): Promise<SummaryResult> {
  const text = content.trim();

  if (!text) {
    throw new Error("Your note is empty.");
  }

  if (text.length > 12000) {
    throw new Error("Notes must be 12,000 characters or fewer.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${url}/summary/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: text }),
      signal: controller.signal,
    });

    console.log(response);

    const data: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : "Unable to summarize this note.";

      throw new Error(message);
    }

    if (
      typeof data !== "object" ||
      data === null ||
      !("summary" in data) ||
      typeof data.summary !== "string" ||
      !("keyPoints" in data) ||
      !Array.isArray(data.keyPoints) ||
      !data.keyPoints.every((item) => typeof item === "string") ||
      !("actionItems" in data) ||
      !Array.isArray(data.actionItems) ||
      !data.actionItems.every((item) => typeof item === "string")
    ) {
      throw new Error("The AI returned an invalid response.");
    }

    return data as SummaryResult;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
