import { Accelerometer } from "expo-sensors";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

type ShakeDetectionOptions = {
  enabled?: boolean;
  onShake: () => void;
};

const SHAKE_THRESHOLD = 2.2;
const SHAKE_COOLDOWN_MS = 1800;
const UPDATE_INTERVAL_MS = 100;

export function useShakeDetection({
  enabled = true,
  onShake,
}: ShakeDetectionOptions) {
  const callbackRef = useRef(onShake);
  const lastShakeRef = useRef(0);

  // Always keep the latest callback without restarting the sensor.
  useEffect(() => {
    callbackRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;
    let mounted = true;
    let appStateSubscription: ReturnType<
      typeof AppState.addEventListener
    > | null = null;

    const stopListening = () => {
      subscription?.remove();
      subscription = null;
    };

    const startListening = async () => {
      if (!mounted || AppState.currentState !== "active" || subscription) {
        return;
      }

      try {
        const available = await Accelerometer.isAvailableAsync();

        if (
          !available ||
          !mounted ||
          AppState.currentState !== "active" ||
          subscription
        ) {
          return;
        }

        Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);

        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const now = Date.now();

          // The accelerometer includes gravity, so detect a sudden
          // deviation from its usual magnitude.
          if (
            Math.abs(magnitude - 1) > SHAKE_THRESHOLD &&
            now - lastShakeRef.current >= SHAKE_COOLDOWN_MS
          ) {
            lastShakeRef.current = now;
            callbackRef.current();
          }
        });
      } catch (error) {
        console.warn("Shake detection could not start:", error);
      }
    };

    void startListening();

    appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void startListening();
      } else {
        stopListening();
      }
    });

    return () => {
      mounted = false;
      stopListening();
      appStateSubscription?.remove();
    };
  }, [enabled]);
}
