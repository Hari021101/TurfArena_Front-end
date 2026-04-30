import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SHADOWS,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
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
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  iconColor?: string;
  iconSize?: number;
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
  iconColor,
  iconSize = 20,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: APP_BORDER_RADIUS.md,
      ...APP_SHADOWS.small,
    };

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingHorizontal: APP_SPACING.md,
        paddingVertical: APP_SPACING.sm,
        minHeight: 40,
      },
      medium: {
        paddingHorizontal: APP_SPACING.lg,
        paddingVertical: APP_SPACING.md,
        minHeight: 52,
      },
      large: {
        paddingHorizontal: APP_SPACING.xl,
        paddingVertical: APP_SPACING.lg,
        minHeight: 60,
      },
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.secondary },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: colors.primary,
      },
      ghost: { backgroundColor: "transparent" },
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
      small: { fontSize: APP_FONT_SIZES.sm },
      medium: { fontSize: APP_FONT_SIZES.md },
      large: { fontSize: APP_FONT_SIZES.lg },
    };

    const variantStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: colors.white },
      secondary: { color: colors.white },
      outline: { color: colors.primary },
      ghost: { color: colors.primary },
    };

    return {
      fontWeight: "600",
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <Ionicons
        name={icon}
        size={iconSize}
        color={
          iconColor ||
          (variant === "outline" || variant === "ghost"
            ? colors.primary
            : colors.white)
        }
        style={
          iconPosition === "left"
            ? { marginRight: APP_SPACING.sm }
            : { marginLeft: APP_SPACING.sm }
        }
      />
    );
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
              ? colors.primary
              : colors.white
          }
        />
      ) : (
        <>
          {iconPosition === "left" && renderIcon()}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {iconPosition === "right" && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
