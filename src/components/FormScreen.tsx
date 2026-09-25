import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import type { ReactNode } from 'react';

import { IconButton } from '@/components/IconButton';
import { Typography } from '@/components/Typography';
import { useColors } from '@/hooks/useColors';
import { commonStyles } from '@/styles/common';

export function FormScreen({
  children,
  onBack,
  title,
  backTestID,
}: {
  children: ReactNode;
  onBack?: () => void;
  title: string;
  backTestID: string;
}) {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View
      style={[
        commonStyles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? insets.top : 0
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            commonStyles.formContent,
            {
              paddingTop:
                insets.top +
                (Platform.OS === 'web' ? 67 : 0) +
                8,

              paddingBottom:
                insets.bottom +
                (Platform.OS === 'web' ? 34 : 0) +
                24,
            },
          ]}
        >
          <View style={commonStyles.topBar}>
            <IconButton
              accessibilityLabel="Go back"
              accessibilityRole="button"
              icon="arrow-left"
              onPress={handleBack}
              testID={backTestID}
            />

            <Typography variant="heading">
              {title}
            </Typography>

            <View style={commonStyles.topBarSpacer} />
          </View>

          <View style={commonStyles.form}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export function FormLabel({
  children,
}: {
  children: string;
}) {
  return (
    <Typography
      color="mutedForeground"
      variant="label"
    >
      {children}
    </Typography>
  );
}

const styles = {
  keyboardAvoidingView: {
    flex: 1,
  },
};
