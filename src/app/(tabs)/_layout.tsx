import { router, Tabs, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { authenticateForPrivateNote } from "@/service/private/auth";
import { Ionicons } from "@expo/vector-icons";

const PRIVATE_VAULT_HOLD_MS = 5000;

function NotesTabButton(props: React.ComponentProps<typeof Pressable>) {
  const navigation = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTriggeredRef = useRef(false);

  const cancelHold = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => cancelHold();
  }, []);

  const handlePressIn = () => {
    cancelHold();
    holdTriggeredRef.current = false;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      holdTriggeredRef.current = true;
      navigation.push("/private-notes");
    }, PRIVATE_VAULT_HOLD_MS);
  };

  const handlePressOut = () => {
    cancelHold();
  };

  const handlePress = (
    event: Parameters<NonNullable<typeof props.onPress>>[0],
  ) => {
    if (holdTriggeredRef.current) {
      holdTriggeredRef.current = false;
      return;
    }

    props.onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={() => {}}
    >
      {props.children}
    </Pressable>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authenticatingRef = useRef(false);

  useShakeDetection({
    enabled: true,
    onShake: async () => {
      if (authenticatingRef.current) return;

      authenticatingRef.current = true;
      setIsAuthenticating(true);

      try {
        const authenticated = await authenticateForPrivateNote();

        if (authenticated) {
          router.push("/private-notes");
        }
      } catch (error) {
        console.warn("Private notes authentication failed:", error);
      } finally {
        authenticatingRef.current = false;
        setIsAuthenticating(false);
      }
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,

        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,

          marginLeft: 20,
          marginRight: 20,
          bottom: isWeb ? 16 : Math.max(insets.bottom, 12),

          height: 64,
          paddingTop: 7,
          paddingBottom: 7,

          backgroundColor: colors.background,

          // Remove the top border and keep a single subtle outline.
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 24,

          // Floating effect
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },

        tabBarItemStyle: {
          borderRadius: 18,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },

        tabBarIconStyle: {
          marginTop: 1,
        },

        tabBarBackground: () => (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.background,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          // Uncomment to enable the 5-second private-vault hold.
          // tabBarButton: (props) => <NotesTabButton {...props} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="snippets"
        options={{
          title: "Snippets",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "code-slash" : "code-slash-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  background: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
});
