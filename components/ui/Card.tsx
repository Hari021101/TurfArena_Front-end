import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_SHADOWS,
    APP_SPACING,
} from "@/constants/appTheme";
import React from "react";
import {
    GestureResponderEvent,
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
  style?: ViewStyle;
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
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: APP_COLORS.card,
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
        borderColor: APP_COLORS.border,
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
