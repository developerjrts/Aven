import { Highlight, themes } from "prism-react-renderer";
import { ScrollView, Text, View } from "react-native";

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

    default:
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

  const visibleCode = visibleLines.join("\n");

  const theme = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      backgroundColor: colors.secondary,
      fontFamily: "monospace",
      fontSize: 13,
      lineHeight: 20,
    },
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        className="w-full px-1 py-3"
        style={{ backgroundColor: colors.secondary }}
      >
        <Highlight code={visibleCode} language={prismLanguage} theme={theme}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <View className="w-full">
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line });

                return (
                  <View
                    key={lineIndex}
                    {...lineProps}
                    className="min-h-5 w-full flex-row"
                  >
                    <Text
                      className="w-9 shrink-0 pr-[10px] text-right text-xs"
                      style={{
                        color: colors.mutedForeground,
                        fontFamily: "monospace",
                        lineHeight: 20,
                        opacity: 0.55,
                      }}
                    >
                      {lineIndex + 1}
                    </Text>

                    <Text
                      className="flex-1 text-[13px]"
                      style={{
                        color: colors.foreground,
                        fontFamily: "monospace",
                        lineHeight: 20,
                        flexShrink: 1,
                      }}
                    >
                      {line.map((token, tokenIndex) => {
                        const tokenProps = getTokenProps({ token });

                        return (
                          <Text
                            key={`${lineIndex}-${tokenIndex}`}
                            {...tokenProps}
                          >
                            {token.content}
                          </Text>
                        );
                      })}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </Highlight>
      </View>
    </ScrollView>
  );
}
