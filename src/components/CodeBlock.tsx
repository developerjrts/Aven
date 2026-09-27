import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SyntaxHighlightedCode } from '@/components/SyntaxHighlightedCode';
import { type SnippetLanguage } from '@/context/snippets';
import { useColors } from '@/hooks/useColors';

interface CodeBlockProps {
  code: string;
  language: SnippetLanguage;
  numberOfLines?: number;
  languageLabel?: string;
  onCopy?: () => void;
}

export function CodeBlock({
  code,
  language,
  numberOfLines,
  languageLabel,
  onCopy,
}: CodeBlockProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
          colors.secondary,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor:
              colors.secondary,
            borderBottomColor:
              colors.border,
          },
        ]}
      >
        <View style={styles.languageContainer}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
          />

          <Text
            style={[
              styles.language,
              {
                color:
                  colors.mutedForeground,
              },
            ]}
          >
            {languageLabel ?? language}
          </Text>
        </View>

        {onCopy && (
          <Pressable
            accessibilityLabel="Copy code"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onCopy}
            style={({ pressed }) => [
              styles.copyButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="copy"
              size={15}
              color={colors.mutedForeground}
            />
          </Pressable>
        )}
      </View>
        
      <SyntaxHighlightedCode
        code={code}
        language={language}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 10,
  },

  header: {
    minHeight: 34,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },

  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  language: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  copyButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },

  pressed: {
    opacity: 0.5,
  },
});
