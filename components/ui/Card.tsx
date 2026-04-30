import {
    APP_BORDER_RADIUS,
    APP_SHADOWS,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  noPadding?: boolean;
}

export default function Card({
  children,
  variant = "default",
  onPress,
  style,
  padding,
  noPadding = false,
}: CardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: APP_BORDER_RADIUS.lg,
      padding: noPadding ? 0 : (padding ?? APP_SPACING.md),
    };

    const variantStyles: Record<CardVariant, ViewStyle> = {
      default: {
        ...baseStyle,
      },
      elevated: {
        ...baseStyle,
        ...APP_SHADOWS.medium,
      },
      outlined: {
        ...baseStyle,
        borderWidth: 1,
        borderColor: colors.border,
      },
    };

    return variantStyles[variant];
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  // Styles are computed dynamically
});
