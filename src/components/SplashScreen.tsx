import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type SplashScreenProps = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const colors = useColors();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const developerOpacity = useRef(new Animated.Value(0)).current;
  const developerTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const entranceAnimation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]);

    const developerAnimation = Animated.parallel([
      Animated.timing(developerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(developerTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    const developerTimer = setTimeout(() => {
      developerAnimation.start();
    }, 500);

    const finishTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(developerOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onFinish();
        }
      });
    }, 2200);

    return () => {
      clearTimeout(developerTimer);
      clearTimeout(finishTimer);
      entranceAnimation.stop();
      developerAnimation.stop();
    };
  }, [opacity, scale, developerOpacity, developerTranslateY, onFinish]);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Animated.View
        className="items-center px-6"
        style={{
          opacity,
          transform: [{ scale }],
        }}
      >
        <View
          className="mb-[22px] h-[82px] w-[82px] items-center justify-center rounded-[22px] border"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.border,
          }}
        >
          <Feather name="edit-3" size={34} color={colors.primary} />
        </View>

        <Text
          className="text-center text-[27px]"
          style={{
            color: colors.foreground,
            fontFamily: "Inter_700Bold",
            letterSpacing: -0.5,
          }}
        >
          Aven Notes
        </Text>

        <Text
          className="mt-2 text-center text-[13px]"
          style={{
            color: colors.mutedForeground,
            fontFamily: "Inter_400Regular",
          }}
        >
          Capture. Organize. Remember.
        </Text>

        <Animated.View
          className="mt-9 flex-row items-center justify-center"
          style={{
            opacity: developerOpacity,
            transform: [{ translateY: developerTranslateY }],
          }}
        >
          <View
            className="mr-3 h-[2px] w-5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />

          <Text
            className="text-center text-[12px]"
            style={{
              color: colors.primary,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: 0.2,
            }}
          >
            Developer JRTS
            <Text
              style={{
                color: colors.mutedForeground,
                fontFamily: "Inter_400Regular",
              }}
            >
              {" — "}
            </Text>
            I create emotions
          </Text>

          <View
            className="ml-3 h-[2px] w-5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </Animated.View>
      </Animated.View>

      <View className="absolute bottom-[38px] items-center">
        <Text
          className="text-[11px]"
          style={{
            color: colors.mutedForeground,
            fontFamily: "Inter_500Medium",
            letterSpacing: 0.5,
          }}
        >
          Aven Notes
        </Text>
      </View>
    </View>
  );
}
