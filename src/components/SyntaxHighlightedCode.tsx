import { Highlight, themes } from 'prism-react-renderer';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { type SnippetLanguage } from '@/context/snippets';
import { useColors } from '@/hooks/useColors';

interface SyntaxHighlightedCodeProps {
  code: string;
  language: SnippetLanguage;
  numberOfLines?: number;
}

type PrismLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'bash'
  | 'json'
  | 'text';

function getPrismLanguage(
  language: SnippetLanguage,
): PrismLanguage {
  switch (language) {
    case 'javascript':
      return 'javascript';

    case 'typescript':
      return 'typescript';

    case 'python':
      return 'python';

    case 'bash':
      return 'bash';

    case 'json':
      return 'json';

    case 'plaintext':
    default:
      return 'text';
  }
}

export function SyntaxHighlightedCode({
  code,
  language,
  numberOfLines,
}: SyntaxHighlightedCodeProps) {
  const colors = useColors();

  const prismLanguage =
    getPrismLanguage(language);

  const codeLines = code.split('\n');

  const visibleLines =
    numberOfLines === undefined
      ? codeLines
      : codeLines.slice(0, numberOfLines);

  const visibleCode =
    visibleLines.join('\n');

  /*
   * Start with VS Code's dark theme, then adapt
   * the editor background to Aven's theme.
   */
  const theme = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      backgroundColor: colors.secondary,
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 20,
    },
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View
        style={[
          styles.editor,
          {
            backgroundColor:
              colors.secondary,
          },
        ]}
      >
        <Highlight
          code={visibleCode}
          language={prismLanguage}
          theme={theme}
        >
          {({
            tokens,
            getLineProps,
            getTokenProps,
          }) => (
            <View>
              {tokens.map((line, lineIndex) => {
                const lineProps =
                  getLineProps({
                    line,
                  });

                return (
                  <View
                    key={lineIndex}
                    {...lineProps}
                    style={styles.line}
                  >
                    <Text
                      style={[
                        styles.lineNumber,
                        {
                          color:
                            colors.mutedForeground,
                        },
                      ]}
                    >
                      {lineIndex + 1}
                    </Text>

                    <Text
                      style={[
                        styles.codeText,
                        {
                          color:
                            colors.foreground,
                        },
                      ]}
                    >
                      {line.map(
                        (token, tokenIndex) => {
                          const tokenProps =
                            getTokenProps({
                              token,
                            });

                          return (
                            <Text
                              key={`${lineIndex}-${tokenIndex}`}
                              {...tokenProps}
                            >
                              {token.content}
                            </Text>
                          );
                        },
                      )}
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

const styles = StyleSheet.create({
  scrollContent: {
    minWidth: '100%',
  },

  editor: {
    minWidth: '100%',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  line: {
    flexDirection: 'row',
    minHeight: 20,
  },

  lineNumber: {
    width: 36,
    paddingRight: 10,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
    opacity: 0.55,
  },

  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
});
