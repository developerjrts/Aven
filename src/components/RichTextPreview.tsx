import { Text, type TextStyle } from 'react-native';

import { Typography } from '@/components/Typography';

interface RichTextRun {
  text: string;
  style: TextStyle;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function removeDangerousHtml(value: string) {
  return value
    .replace(
      /<(script|style|iframe|object|embed|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      '',
    )
    .replace(
      /<(script|style|iframe|object|embed|noscript|template)\b[^>]*\/?>/gi,
      '',
    );
}

function hasHtml(value: string) {
  return /<\/?(?:strong|b|em|i|u|ul|ol|li|br|div|p)\b/i.test(
    value,
  );
}

function appendText(
  runs: RichTextRun[],
  text: string,
  style: TextStyle,
) {
  if (!text) {
    return;
  }

  const decodedText = decodeHtmlEntities(text);
  const previous = runs[runs.length - 1];

  if (
    previous &&
    JSON.stringify(previous.style) ===
      JSON.stringify(style)
  ) {
    previous.text += decodedText;
  } else {
    runs.push({
      text: decodedText,
      style,
    });
  }
}

function appendNewline(
  runs: RichTextRun[],
) {
  const previous = runs[runs.length - 1];

  if (
    previous &&
    !previous.text.endsWith('\n')
  ) {
    appendText(
      runs,
      '\n',
      previous.style,
    );
  }
}

function parseRichText(
  value: string,
): RichTextRun[] {
  const safeValue =
    removeDangerousHtml(value);

  if (!hasHtml(safeValue)) {
    return [
      {
        text: decodeHtmlEntities(safeValue),
        style: {},
      },
    ];
  }

  const runs: RichTextRun[] = [];

  const styleStack: Array<{
    tag: string;
    style: TextStyle;
  }> = [];

  const tokens =
    safeValue.match(
      /<[^>]+>|[^<]+/g,
    ) ?? [];

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      appendText(
        runs,
        token,
        styleStack[
          styleStack.length - 1
        ]?.style ?? {},
      );

      continue;
    }

    const tagMatch = token.match(
      /^<\/?\s*([a-z0-9]+)/i,
    );

    const tag =
      tagMatch?.[1]?.toLowerCase();

    if (!tag) {
      continue;
    }

    const isClosingTag =
      /^<\//.test(token);

    if (tag === 'br') {
      appendNewline(runs);
    }

    else if (
      tag === 'ul' ||
      tag === 'ol'
    ) {
      if (isClosingTag) {
        appendNewline(runs);
      }
    }

    else if (tag === 'li') {
      if (isClosingTag) {
        appendNewline(runs);
      } else {
        appendNewline(runs);

        appendText(
          runs,
          '• ',
          styleStack[
            styleStack.length - 1
          ]?.style ?? {},
        );
      }
    }

    else if (
      tag === 'div' ||
      tag === 'p'
    ) {
      if (isClosingTag) {
        appendNewline(runs);
      }
    }

    else if (
      tag === 'strong' ||
      tag === 'b' ||
      tag === 'em' ||
      tag === 'i' ||
      tag === 'u'
    ) {
      if (isClosingTag) {
        const stackIndex =
          styleStack
            .map((item) => item.tag)
            .lastIndexOf(tag);

        if (stackIndex !== -1) {
          styleStack.splice(
            stackIndex,
            1,
          );
        }
      } else {
        const currentStyle =
          styleStack[
            styleStack.length - 1
          ]?.style ?? {};

        styleStack.push({
          tag,
          style: {
            ...currentStyle,

            ...(tag === 'strong' ||
            tag === 'b'
              ? {
                  fontFamily:
                    'Inter_700Bold',
                }
              : {}),

            ...(tag === 'em' ||
            tag === 'i'
              ? {
                  fontStyle:
                    'italic',
                }
              : {}),

            ...(tag === 'u'
              ? {
                  textDecorationLine:
                    'underline',
                }
              : {}),
          },
        });
      }
    }
  }

  return runs.length > 0
    ? runs
    : [{ text: '', style: {} }];
}

export function getRichTextPlainText(
  value: string,
) {
  return parseRichText(value)
    .map((run) => run.text)
    .join('')
    .replace(/\n+$/, '');
}

export function RichTextPreview({
  numberOfLines,
  style,
  value,
}: {
  numberOfLines?: number;
  style?: TextStyle;
  value: string;
}) {
  return (
    <Typography
      color="mutedForeground"
      numberOfLines={numberOfLines}
      style={style}
    >
      {parseRichText(value).map(
        (run, index) => (
          <Text
            key={`${run.text}-${index}`}
            style={run.style}
          >
            {run.text}
          </Text>
        ),
      )}
    </Typography>
  );
}
