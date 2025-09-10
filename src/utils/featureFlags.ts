/**
 * Feature Flags Utility for Guest Checkout Implementation
 *
 * This module provides a centralized way to manage feature flags
 * for the guest checkout functionality and related features.
 */

export const getFeatureFlag = (flagName: string): boolean => {
  if (typeof window === "undefined") {
    // Server-side: use process.env
    const value = process.env[`NEXT_PUBLIC_${flagName}`];
    return value === "true";
  } else {
    // Client-side: use window.ENV if available, fallback to process.env
    const value = process.env[`NEXT_PUBLIC_${flagName}`];
    return value === "true";
  }
};

export const FeatureFlags = {
  ENABLE_WHATSAPP_NOTIFICATIONS: getFeatureFlag(
    "ENABLE_WHATSAPP_NOTIFICATIONS"
  ),
} as const;

// Type-safe feature flag checker
export const isFeatureEnabled = (
  feature: keyof typeof FeatureFlags
): boolean => {
  return FeatureFlags[feature];
};

// Development helper to log current feature flag status
export const logFeatureFlags = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("🚩 Feature Flags Status:", {
      ENABLE_WHATSAPP_NOTIFICATIONS: FeatureFlags.ENABLE_WHATSAPP_NOTIFICATIONS,
    });
  }
};
