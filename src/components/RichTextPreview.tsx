import { useMemo } from "react";
import { Text } from "react-native";

import { Typography } from "@/components/Typography";

type TextStyle = {
  fontWeight?: "400" | "500" | "600" | "700";
  fontStyle?: "italic" | "normal";
  textDecorationLine?: "underline" | "line-through" | "none";
  fontFamily?: string;
};

type RichTextRun = {
  text: string;
  style?: TextStyle;
};

type RichTextPreviewProps = {
  value: string;
  style?: {
    color?: string;
    fontSize?: number;
    lineHeight?: number;
  };
  numberOfLines?: number;
};

const EMPTY_RUNS: RichTextRun[] = [];

function decodeHtmlEntities(value: string): string {
  const entities: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    mdash: "—",
    ndash: "–",
    hellip: "…",
    copy: "©",
    reg: "®",
    trade: "™",
  };

  return value.replace(
    /&(#(?:x[0-9a-f]+|[0-9]+)|[a-z]+);/gi,
    (entity, code: string) => {
      if (/^#x/i.test(code)) {
        const number = Number.parseInt(code.slice(2), 16);

        return Number.isFinite(number) && number >= 0 && number <= 0x10ffff
          ? String.fromCodePoint(number)
          : entity;
      }

      if (code.startsWith("#")) {
        const number = Number.parseInt(code.slice(1), 10);

        return Number.isFinite(number) && number >= 0 && number <= 0x10ffff
          ? String.fromCodePoint(number)
          : entity;
      }

      return entities[code.toLowerCase()] ?? entity;
    },
  );
}

function normalizeText(value: string): string {
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/&#x20;|&#32;/gi, " ");
}

function appendText(
  runs: RichTextRun[],
  text: string,
  style: TextStyle = {},
): void {
  if (!text) return;

  const decoded = decodeHtmlEntities(text);
  if (!decoded) return;

  const previous = runs[runs.length - 1];

  if (
    previous &&
    JSON.stringify(previous.style ?? {}) === JSON.stringify(style)
  ) {
    previous.text += decoded;
    return;
  }

  runs.push({
    text: decoded,
    ...(Object.keys(style).length ? { style } : {}),
  });
}

function parseInlineMarkdown(
  value: string,
  baseStyle: TextStyle = {},
): RichTextRun[] {
  const runs: RichTextRun[] = [];
  const pattern =
    /(\*\*[\s\S]+?\*\*|__[\s\S]+?__|~~[\s\S]+?~~|`[^`]+`|\*[^*\n]+?\*|_[^_\n]+?_)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    appendText(runs, value.slice(lastIndex, match.index), baseStyle);

    const token = match[0];
    let text = token;
    const style: TextStyle = { ...baseStyle };

    if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      text = token.slice(2, -2);
      style.fontWeight = "700";
    } else if (token.startsWith("~~") && token.endsWith("~~")) {
      text = token.slice(2, -2);
      style.textDecorationLine = "line-through";
    } else if (token.startsWith("`") && token.endsWith("`")) {
      text = token.slice(1, -1);
      style.fontFamily = "monospace";
    } else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      text = token.slice(1, -1);
      style.fontStyle = "italic";
    }

    appendText(runs, text, style);
    lastIndex = pattern.lastIndex;
  }

  appendText(runs, value.slice(lastIndex), baseStyle);

  return runs;
}

function trimRuns(runs: RichTextRun[]): RichTextRun[] {
  const result = runs.map((run) => ({ ...run }));

  while (result.length && !result[0].text.trim()) {
    result.shift();
  }

  while (result.length && !result[result.length - 1].text.trim()) {
    result.pop();
  }

  return result;
}

function parsePlainText(value: string): RichTextRun[] {
  const runs: RichTextRun[] = [];

  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      appendText(runs, "\n");
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      appendText(runs, headingMatch[2], { fontWeight: "700" });
      appendText(runs, "\n");
      continue;
    }

    const numberedMatch = line.match(/^(\d+[.)])\s+(.+)$/);

    if (numberedMatch) {
      appendText(runs, `${numberedMatch[1]} `);
      runs.push(...parseInlineMarkdown(numberedMatch[2]));
      appendText(runs, "\n");
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);

    if (bulletMatch) {
      appendText(runs, "• ");
      runs.push(...parseInlineMarkdown(bulletMatch[1]));
      appendText(runs, "\n");
      continue;
    }

    runs.push(...parseInlineMarkdown(line));
    appendText(runs, "\n");
  }

  return trimRuns(runs);
}

function parseHtml(value: string): RichTextRun[] {
  const runs: RichTextRun[] = [];
  const tokens = /<!--[\s\S]*?-->|<\/?[a-z][^>]*>|[^<]+|</gi;

  let match: RegExpExecArray | null;
  let boldDepth = 0;
  let italicDepth = 0;
  let underlineDepth = 0;
  let strikeDepth = 0;
  let headingDepth = 0;
  let orderedListDepth = 0;
  let listItemIndex = 0;

  const currentStyle = (): TextStyle => {
    const style: TextStyle = {};

    if (boldDepth > 0 || headingDepth > 0) {
      style.fontWeight = "700";
    }

    if (italicDepth > 0) {
      style.fontStyle = "italic";
    }

    if (underlineDepth > 0) {
      style.textDecorationLine = "underline";
    } else if (strikeDepth > 0) {
      style.textDecorationLine = "line-through";
    }

    return style;
  };

  const ensureNewLine = () => {
    if (runs.length && !runs[runs.length - 1].text.endsWith("\n")) {
      appendText(runs, "\n");
    }
  };

  while ((match = tokens.exec(value)) !== null) {
    const token = match[0];

    if (token.startsWith("<!--")) continue;

    if (!token.startsWith("<")) {
      appendText(runs, token, currentStyle());
      continue;
    }

    const tagMatch = token.match(/^<\s*(\/?)\s*([a-z0-9]+)[^>]*>$/i);

    if (!tagMatch) {
      appendText(runs, token, currentStyle());
      continue;
    }

    const closing = tagMatch[1] === "/";
    const tag = tagMatch[2].toLowerCase();

    if (!closing) {
      switch (tag) {
        case "strong":
        case "b":
          boldDepth++;
          break;

        case "em":
        case "i":
          italicDepth++;
          break;

        case "u":
          underlineDepth++;
          break;

        case "s":
        case "del":
        case "strike":
          strikeDepth++;
          break;

        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          ensureNewLine();
          headingDepth++;
          break;

        case "p":
        case "div":
        case "br":
        case "li":
          ensureNewLine();
          break;

        case "ul":
          ensureNewLine();
          break;

        case "ol":
          ensureNewLine();
          orderedListDepth++;
          listItemIndex = 0;
          break;

        default:
          break;
      }

      if (tag === "li") {
        if (orderedListDepth > 0) {
          listItemIndex++;
          appendText(runs, `${listItemIndex}. `);
        } else {
          appendText(runs, "• ");
        }
      }
    } else {
      switch (tag) {
        case "strong":
        case "b":
          boldDepth = Math.max(0, boldDepth - 1);
          break;

        case "em":
        case "i":
          italicDepth = Math.max(0, italicDepth - 1);
          break;

        case "u":
          underlineDepth = Math.max(0, underlineDepth - 1);
          break;

        case "s":
        case "del":
        case "strike":
          strikeDepth = Math.max(0, strikeDepth - 1);
          break;

        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          headingDepth = Math.max(0, headingDepth - 1);
          ensureNewLine();
          break;

        case "p":
        case "div":
        case "li":
        case "ul":
          ensureNewLine();
          break;

        case "ol":
          orderedListDepth = Math.max(0, orderedListDepth - 1);
          ensureNewLine();
          break;

        default:
          break;
      }
    }
  }

  return trimRuns(runs);
}

function hasHtml(value: string): boolean {
  return /<\/?(?:p|div|br|strong|b|em|i|u|s|del|strike|ul|ol|li|h[1-6])\b[^>]*>/i.test(
    value,
  );
}

function parseRichText(value: string): RichTextRun[] {
  const normalized = normalizeText(value);

  if (!normalized.trim()) return EMPTY_RUNS;

  const safeValue = normalized
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "");

  if (hasHtml(safeValue)) {
    return parseHtml(safeValue);
  }

  return parsePlainText(safeValue.replace(/<[^>]*>/g, ""));
}

export function getRichTextPlainText(value: string): string {
  return parseRichText(value)
    .map((run) => run.text)
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function RichTextPreview({
  value,
  style,
  numberOfLines,
}: RichTextPreviewProps) {
  const runs = useMemo(() => parseRichText(value ?? ""), [value]);

  if (!runs.length) {
    return null;
  }

  return (
    <Typography
      numberOfLines={numberOfLines}
      style={[
        {
          lineHeight: 24,
        },
        style,
      ]}
    >
      {runs.map((run, index) => (
        <Text key={`${index}-${run.text.slice(0, 12)}`} style={run.style}>
          {run.text}
        </Text>
      ))}
    </Typography>
  );
}
