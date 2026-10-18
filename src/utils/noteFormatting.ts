function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function removeTrailingEmptyBlocks(value: string): string {
  return value.replace(
    /(?:\s*<(?:div|p)>\s*(?:<br\s*\/?>|&nbsp;|\s)*<\/(?:div|p)>\s*)+$/gi,
    "",
  );
}

function hasRichTextHtml(value: string): boolean {
  return /<\/?(?:div|p|h[1-6]|ul|ol|li|strong|b|em|i|u|br|blockquote|pre|code|a)\b/i.test(
    value,
  );
}

export function normalizeNoteContent(value: string): string {
  if (!value) return "";

  let text = value
    // Convert literal backslash-n sequences to actual line breaks.
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    // Normalize actual line endings.
    .replace(/\r\n?/g, "\n")
    .trim();

  text = removeTrailingEmptyBlocks(text).trim();

  // Keep existing rich-text HTML intact.
  if (hasRichTextHtml(text)) {
    return text;
  }

  // Decode existing entities before safely creating HTML.
  text = decodeEntities(text);

  const lines = text.split("\n");
  const html: string[] = [];

  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;

    html.push(
      `<p>${paragraph.map((line) => escapeHtml(line)).join("<br />")}</p>`,
    );

    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;

    html.push(`</${listType}>`);
    listType = null;
  };

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    const nextNonEmptyLine = lines
      .slice(index + 1)
      .find((item) => item.trim())
      ?.trim();

    // Treat the first line as the title when followed by structured content.
    if (
      html.length === 0 &&
      paragraph.length === 0 &&
      nextNonEmptyLine &&
      (/^\d+[.)]\s+/.test(nextNonEmptyLine) ||
        /^[-*•]\s+/.test(nextNonEmptyLine))
    ) {
      html.push(`<h1>${escapeHtml(line)}</h1>`);
      continue;
    }

    // Numbered sections, e.g. "1. Definition".
    const numberedHeading = line.match(/^(\d+)[.)]\s+(.+)$/);

    if (numberedHeading) {
      flushParagraph();
      closeList();

      html.push(
        `<h2>${escapeHtml(
          `${numberedHeading[1]}. ${numberedHeading[2]}`,
        )}</h2>`,
      );

      continue;
    }

    // Markdown-style headings.
    const markdownHeading = line.match(/^(#{1,3})\s+(.+)$/);

    if (markdownHeading) {
      flushParagraph();
      closeList();

      const level = markdownHeading[1].length;

      html.push(`<h${level}>${escapeHtml(markdownHeading[2])}</h${level}>`);

      continue;
    }

    // Bullet points.
    const bullet = line.match(/^[-*•]\s+(.+)$/);

    if (bullet) {
      flushParagraph();

      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }

      html.push(`<li>${escapeHtml(bullet[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line);
  }

  flushParagraph();
  closeList();

  return html.join("\n");
}
