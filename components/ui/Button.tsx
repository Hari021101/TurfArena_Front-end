import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SHADOWS,
    APP_SPACING,
} from "@/constants/appTheme";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: APP_BORDER_RADIUS.md,
      ...APP_SHADOWS.small,
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingHorizontal: APP_SPACING.md,
        paddingVertical: APP_SPACING.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: APP_SPACING.lg,
        paddingVertical: APP_SPACING.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: APP_SPACING.xl,
        paddingVertical: APP_SPACING.lg,
        minHeight: 56,
      },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: APP_COLORS.primary,
      },
      secondary: {
        backgroundColor: APP_COLORS.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: APP_COLORS.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: {
        fontSize: APP_FONT_SIZES.sm,
      },
      medium: {
        fontSize: APP_FONT_SIZES.md,
      },
      large: {
        fontSize: APP_FONT_SIZES.lg,
      },
    };

    const variantStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: APP_COLORS.white,
      },
      secondary: {
        color: APP_COLORS.white,
      },
      outline: {
        color: APP_COLORS.primary,
      },
      ghost: {
        color: APP_COLORS.primary,
      },
    };

    return {
      fontWeight: "600",
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? APP_COLORS.primary
              : APP_COLORS.white
          }
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <View style={{ marginRight: APP_SPACING.sm }}>{icon}</View>
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && (
            <View style={{ marginLeft: APP_SPACING.sm }}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Styles are computed dynamically
});
