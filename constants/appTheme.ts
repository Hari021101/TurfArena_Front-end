// App-specific theme configuration for Turf Arena

export const APP_COLORS = {
  // Primary colors
  primary: "#10B981", // Green for sports/turf theme
  primaryDark: "#059669",
  primaryLight: "#34D399",

  // Secondary colors
  secondary: "#3B82F6",
  secondaryDark: "#2563EB",
  secondaryLight: "#60A5FA",

  // Accent
  accent: "#F59E0B",
  accentDark: "#D97706",
  accentLight: "#FBBF24",

  // Backgrounds
  background: "#0F172A",
  backgroundLight: "#1E293B",
  card: "#1E293B",
  cardLight: "#334155",

  // Text
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Slot status colors
  slotAvailable: "#10B981",
  slotBooked: "#EF4444",
  slotSelected: "#F59E0B",
  slotPast: "#64748B",

  // UI elements
  border: "#334155",
  divider: "#334155",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Transparent variants
  primaryTransparent: "rgba(16, 185, 129, 0.1)",
  secondaryTransparent: "rgba(59, 130, 246, 0.1)",
  accentTransparent: "rgba(245, 158, 11, 0.1)",

  white: "#FFFFFF",
  black: "#000000",
};

export const APP_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const APP_BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
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
  small: {
    shadowColor: APP_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: APP_COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: APP_COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
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
