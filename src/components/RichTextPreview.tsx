import { Text, type TextStyle } from "react-native";

import { Typography } from "@/components/Typography";

interface RichTextRun {
  text: string;
  style: TextStyle;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    );
}

function normalizeText(value: string): string {
  return value.replace(/\\r\\n|\\n|\\r/g, "\n").replace(/\r\n?/g, "\n");
}

function removeDangerousHtml(value: string): string {
  return value
    .replace(
      /<(script|style|iframe|object|embed|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      "",
    )
    .replace(
      /<(script|style|iframe|object|embed|noscript|template)\b[^>]*\/?>/gi,
      "",
    );
}

function hasHtml(value: string): boolean {
  return /<\/?(?:strong|b|em|i|u|ul|ol|li|br|div|p|h[1-6])\b/i.test(value);
}

function appendText(runs: RichTextRun[], text: string, style: TextStyle): void {
  if (!text) return;

  const decoded = decodeHtmlEntities(text);
  const previous = runs[runs.length - 1];

  if (previous && JSON.stringify(previous.style) === JSON.stringify(style)) {
    previous.text += decoded;
  } else {
    runs.push({ text: decoded, style });
  }
}

function appendNewline(runs: RichTextRun[]): void {
  const previous = runs[runs.length - 1];

  if (previous && !previous.text.endsWith("\n")) {
    appendText(runs, "\n", previous.style);
  }
}

function parsePlainText(value: string): RichTextRun[] {
  const runs: RichTextRun[] = [];
  const lines = normalizeText(value).split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      appendNewline(runs);
      continue;
    }

    const heading = line.match(/^#{1,3}\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    const bullet = line.match(/^[-*•]\s+(.+)$/);

    if (heading) {
      appendNewline(runs);
      appendText(runs, heading[1], {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 28,
      });
    } else if (numbered) {
      appendNewline(runs);
      appendText(runs, `${numbered[0].match(/^\d+/)?.[0]}. `, {
        fontWeight: "700",
      });
      appendText(runs, numbered[1], {});
    } else if (bullet) {
      appendNewline(runs);
      appendText(runs, "   • ", {});
      appendText(runs, bullet[1], {});
    } else {
      appendNewline(runs);
      appendText(runs, line, {});
    }

    appendNewline(runs);
  }

  return runs.length ? runs : [{ text: "", style: {} }];
}

function parseHtml(value: string): RichTextRun[] {
  const runs: RichTextRun[] = [];
  const styleStack: Array<{ tag: string; style: TextStyle }> = [];
  const listStack: Array<{ type: "ul" | "ol"; index: number }> = [];

  const currentStyle = (): TextStyle =>
    styleStack[styleStack.length - 1]?.style ?? {};

  const tokens = value.match(/<[^>]+>|[^<]+/g) ?? [];

  for (const token of tokens) {
    if (!token.startsWith("<")) {
      appendText(runs, token, currentStyle());
      continue;
    }

    const tag = token.match(/^<\/?\s*([a-z0-9]+)/i)?.[1]?.toLowerCase();
    if (!tag) continue;

    const closing = /^<\//.test(token);

    if (tag === "br") {
      appendNewline(runs);
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      if (closing) {
        listStack.pop();
        appendNewline(runs);
      } else {
        listStack.push({ type: tag, index: 0 });
      }
      continue;
    }

    if (tag === "li") {
      if (closing) {
        appendNewline(runs);
      } else {
        appendNewline(runs);
        const list = listStack[listStack.length - 1];

        if (list?.type === "ol") {
          list.index += 1;
          appendText(runs, `${list.index}. `, {});
        } else {
          appendText(runs, "• ", {});
        }
      }
      continue;
    }

    if (tag === "p" || tag === "div") {
      if (closing) appendNewline(runs);
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      if (closing) {
        const index = styleStack.map((item) => item.tag).lastIndexOf(tag);
        if (index !== -1) styleStack.splice(index, 1);
        appendNewline(runs);
      } else {
        appendNewline(runs);
        const size =
          (
            { h1: 25, h2: 22, h3: 19, h4: 17, h5: 16, h6: 15 } as Record<
              string,
              number
            >
          )[tag] ?? 16;

        styleStack.push({
          tag,
          style: {
            ...currentStyle(),
            fontSize: size,
            fontWeight: "700",
            lineHeight: size * 1.4,
          },
        });
      }
      continue;
    }

    if (["strong", "b", "em", "i", "u"].includes(tag)) {
      if (closing) {
        const index = styleStack.map((item) => item.tag).lastIndexOf(tag);
        if (index !== -1) styleStack.splice(index, 1);
      } else {
        styleStack.push({
          tag,
          style: {
            ...currentStyle(),
            ...(tag === "strong" || tag === "b"
              ? { fontWeight: "700" as const }
              : {}),
            ...(tag === "em" || tag === "i"
              ? { fontStyle: "italic" as const }
              : {}),
            ...(tag === "u"
              ? { textDecorationLine: "underline" as const }
              : {}),
          },
        });
      }
    }
  }

  return runs.length ? runs : [{ text: "", style: {} }];
}

function parseRichText(value: string): RichTextRun[] {
  const normalized = normalizeText(value);
  const safeValue = removeDangerousHtml(normalized);

  return hasHtml(safeValue) ? parseHtml(safeValue) : parsePlainText(safeValue);
}

export function getRichTextPlainText(value: string): string {
  return parseRichText(value)
    .map((run) => run.text)
    .join("")
    .replace(/\n+$/, "");
}

export function RichTextPreview({
  className,
  numberOfLines,
  style,
  value,
}: {
  className?: string;
  numberOfLines?: number;
  style?: TextStyle;
  value: string;
}) {
  return (
    <Typography
      className={className}
      color="mutedForeground"
      numberOfLines={numberOfLines}
      style={style}
    >
      {parseRichText(value).map((run, index) => (
        <Text key={`${index}-${run.text}`} style={run.style}>
          {run.text}
        </Text>
      ))}
    </Typography>
  );
}
