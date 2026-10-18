import * as LocalAuthentication from "expo-local-authentication";

export type BiometricMethod = "fingerprint" | "face" | "iris";

export async function getAvailableBiometrics(): Promise<BiometricMethod[]> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      return [];
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    const methods: BiometricMethod[] = [];

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      methods.push("fingerprint");
    }

    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      methods.push("face");
    }

    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      methods.push("iris");
    }

    return methods;
  } catch {
    return [];
  }
}

export async function authenticateForPrivateNote(): Promise<boolean> {
  try {
    const methods = await getAvailableBiometrics();

    if (methods.length === 0) {
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock your private note",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
      biometricsSecurityLevel: "strong",
    });

    return result.success;
  } catch {
    return false;
  }
}
