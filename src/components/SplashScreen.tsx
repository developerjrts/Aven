import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useColors } from '@/hooks/useColors';

type SplashScreenProps = {
  onFinish: () => void;
};

export function SplashScreen({
  onFinish,
}: SplashScreenProps) {
  const colors = useColors();

  const opacity = useRef(
    new Animated.Value(0),
  ).current;

  const scale = useRef(
    new Animated.Value(0.85),
  ).current;

  useEffect(() => {
    Animated.parallel([
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
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1400);

    return () => {
      clearTimeout(timer);
    };
  }, [opacity, scale, onFinish]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                colors.secondary,
              borderColor:
                colors.border,
            },
          ]}
        >
          <Feather
            name="edit-3"
            size={34}
            color={colors.primary}
          />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.foreground,
            },
          ]}
        >
          Aven Notes
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color:
                colors.mutedForeground,
            },
          ]}
        >
          Capture. Organize. Remember.
        </Text>
      </Animated.View>

      <View style={styles.bottom}>
        <Text
          style={[
            styles.version,
            {
              color:
                colors.mutedForeground,
            },
          ]}
        >
          Aven Notes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    alignItems: 'center',
  },

  iconContainer: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    height: 82,
    justifyContent: 'center',
    marginBottom: 22,
    width: 82,
  },

  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 27,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 8,
  },

  bottom: {
    bottom: 38,
    position: 'absolute',
  },

  version: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
