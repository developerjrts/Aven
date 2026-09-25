import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '@/hooks/useColors';

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
          paddingBottom: isWeb ? 0 : insets.bottom,
          height: isWeb ? 84 : 58 + insets.bottom,
        },
        tabBarBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.background },
            ]}
          />
        ),
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="snippets"
        options={{
          title: 'Snippets',
          tabBarIcon: ({ color, size }) => (
            <Feather name="code" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}