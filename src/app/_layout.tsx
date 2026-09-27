import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SplashScreen } from '@/components/SplashScreen';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';

import { Stack } from 'expo-router';
import * as NativeSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { NotesProvider } from '@/context/notes';
import { SnippetsProvider } from '@/context/snippets';
import { ThemeProvider } from '@/context/theme';

void NativeSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <StatusBar
        hidden
        translucent
        backgroundColor="transparent"
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] =
    useFonts({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
    });

  const [showSplash, setShowSplash] =
    useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void NativeSplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const finishSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView
            style={{ flex: 1 }}
          >
            <KeyboardProvider>
              <SafeAreaProvider>
                <NotesProvider>
                  <SnippetsProvider>
                    {showSplash ? (
                      <SplashScreen
                        onFinish={finishSplash}
                      />
                    ) : (
                      <RootLayoutNav />
                    )}
                  </SnippetsProvider>
                </NotesProvider>
              </SafeAreaProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
