import { Highlight, themes } from "prism-react-renderer";
import { Text, View } from "react-native";

import { type SnippetLanguage } from "@/context/snippets";
import { useColors } from "@/hooks/useColors";

interface SyntaxHighlightedCodeProps {
  code: string;
  language: SnippetLanguage;
  numberOfLines?: number;
}

type PrismLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "bash"
  | "json"
  | "text";

function getPrismLanguage(language: SnippetLanguage): PrismLanguage {
  switch (language) {
    case "javascript":
    case "typescript":
    case "python":
    case "bash":
    case "json":
      return language;
    case "plaintext":
      return "text";
  }
}

export function SyntaxHighlightedCode({
  code,
  language,
  numberOfLines,
}: SyntaxHighlightedCodeProps) {
  const colors = useColors();

  const prismLanguage = getPrismLanguage(language);
  const codeLines = code.split("\n");

  const visibleLines =
    numberOfLines === undefined ? codeLines : codeLines.slice(0, numberOfLines);

  const theme = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      backgroundColor: colors.secondary,
      color: colors.foreground,
    },
  };

  return (
    <View
      style={{
        width: "100%",
        minWidth: 0,
        backgroundColor: colors.secondary,
        paddingHorizontal: 4,
        paddingVertical: 12,
      }}
    >
      <Highlight
        code={visibleLines.join("\n")}
        language={prismLanguage}
        theme={theme}
      >
        {({ tokens, getTokenProps }) => (
          <View style={{ width: "100%", minWidth: 0 }}>
            {tokens.map((line, lineIndex) => (
              <View
                key={lineIndex}
                style={{
                  width: "100%",
                  minWidth: 0,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    width: 36,
                    flexShrink: 0,
                    paddingRight: 10,
                    textAlign: "right",
                    color: colors.mutedForeground,
                    fontFamily: "monospace",
                    fontSize: 12,
                    lineHeight: 20,
                    opacity: 0.65,
                  }}
                >
                  {lineIndex + 1}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    minWidth: 0,
                    flexShrink: 1,
                    color: colors.foreground,
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {line.map((token, tokenIndex) => {
                    const tokenProps = getTokenProps({ token });
                    const tokenColor = tokenProps.style?.color;

                    return (
                      <Text
                        key={`${lineIndex}-${tokenIndex}`}
                        style={{
                          color:
                            typeof tokenColor === "string"
                              ? tokenColor
                              : colors.foreground,
                        }}
                      >
                        {token.content}
                      </Text>
                    );
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Highlight>
    </View>
  );
}
