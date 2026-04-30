// App-specific theme configuration for Turf Arena
import { Platform } from "react-native";

// Light and Dark color palettes
const LIGHT_COLORS = {
  primary: "#10B981", // Vibrant Emerald
  primaryDark: "#065F46",
  primaryLight: "#6EE7B7",
  secondary: "#3B82F6", // Modern Blue
  secondaryDark: "#1E40AF",
  secondaryLight: "#93C5FD",
  accent: "#8B5CF6", // Electric Violet
  accentDark: "#5B21B6",
  accentLight: "#C4B5FD",
  background: "#F8FAFC",
  backgroundLight: "#FFFFFF",
  card: "#FFFFFF",
  cardLight: "#F1F5F9",
  text: "#0F172A", // Deep Slate
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  success: "#10B981",
  error: "#F43F5E", // Rose
  warning: "#F59E0B",
  info: "#0EA5E9", // Sky
  slotAvailable: "#10B981",
  slotBooked: "#F43F5E",
  slotSelected: "#8B5CF6",
  slotPast: "#94A3B8",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  shadow: "#000000",
  overlay: "rgba(15, 23, 42, 0.4)",
  primaryTransparent: "rgba(16, 185, 129, 0.1)",
  secondaryTransparent: "rgba(59, 130, 246, 0.1)",
  accentTransparent: "rgba(139, 92, 246, 0.1)",
  white: "#FFFFFF",
  black: "#000000",
};

const DARK_COLORS = {
  primary: "#10B981", // Vibrant Emerald
  primaryDark: "#059669",
  primaryLight: "#34D399",
  secondary: "#3B82F6",
  secondaryDark: "#2563EB",
  secondaryLight: "#60A5FA",
  accent: "#A78BFA", // Lighter Violet for dark mode
  accentDark: "#7C3AED",
  accentLight: "#C4B5FD",
  background: "#0F172A", // Deep Navy/Slate
  backgroundLight: "#1E293B",
  card: "#1E293B",
  cardLight: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  success: "#10B981",
  error: "#FB7185", // Soft Rose
  warning: "#FBBF24",
  info: "#38BDF8",
  slotAvailable: "#10B981",
  slotBooked: "#FB7185",
  slotSelected: "#A78BFA",
  slotPast: "#64748B",
  border: "#334155",
  divider: "#1E293B",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.6)",
  primaryTransparent: "rgba(16, 185, 129, 0.12)",
  secondaryTransparent: "rgba(59, 130, 246, 0.12)",
  accentTransparent: "rgba(167, 139, 250, 0.12)",
  white: "#FFFFFF",
  black: "#000000",
};

export const APP_COLORS = DARK_COLORS; // Default to dark for backward compatibility if context is missing

export const getColors = (isDark: boolean) =>
  isDark ? DARK_COLORS : LIGHT_COLORS;

export const APP_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const APP_BORDER_RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
  round: 9999,
};

export const APP_FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const APP_FONT_WEIGHTS = {
  regular: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
};

export const APP_SHADOWS = {
  small: Platform.select({
    web: {
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    default: {
      shadowColor: APP_COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  }),
  medium: Platform.select({
    web: {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    },
    default: {
      shadowColor: APP_COLORS.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  }),
  large: Platform.select({
    web: {
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
    default: {
      shadowColor: APP_COLORS.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  }),
};

export const APP_LAYOUT = {
  screenPadding: APP_SPACING.md,
  cardPadding: APP_SPACING.md,
  sectionMargin: APP_SPACING.lg,
};

export const APP_ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export default {
  COLORS: APP_COLORS,
  SPACING: APP_SPACING,
  BORDER_RADIUS: APP_BORDER_RADIUS,
  FONT_SIZES: APP_FONT_SIZES,
  FONT_WEIGHTS: APP_FONT_WEIGHTS,
  SHADOWS: APP_SHADOWS,
  LAYOUT: APP_LAYOUT,
  ANIMATION: APP_ANIMATION,
};
