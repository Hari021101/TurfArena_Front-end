import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  type?: "text" | "email" | "password" | "phone";
}

export default function Input({
  label,
  error,
  icon,
  iconPosition = "left",
  containerStyle,
  inputStyle,
  type = "text",
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case "email":
        return "email-address";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  };

  const getAutoCompleteType = () => {
    switch (type) {
      case "email":
        return "email";
      case "password":
        return "password";
      case "phone":
        return "tel";
      default:
        return "off";
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {icon && iconPosition === "left" && (
          <Ionicons
            name={icon}
            size={20}
            color={
              error
                ? APP_COLORS.error
                : isFocused
                  ? APP_COLORS.primary
                  : APP_COLORS.textSecondary
            }
            style={styles.iconLeft}
          />
        )}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={APP_COLORS.textSecondary}
          keyboardType={getKeyboardType()}
          autoComplete={getAutoCompleteType()}
          secureTextEntry={type === "password" && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {type === "password" && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconRight}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={APP_COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}

        {icon && iconPosition === "right" && type !== "password" && (
          <Ionicons
            name={icon}
            size={20}
            color={
              error
                ? APP_COLORS.error
                : isFocused
                  ? APP_COLORS.primary
                  : APP_COLORS.textSecondary
            }
            style={styles.iconRight}
          />
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: APP_SPACING.md,
  },
  label: {
    fontSize: APP_FONT_SIZES.sm,
    fontWeight: "600",
    color: APP_COLORS.text,
    marginBottom: APP_SPACING.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    paddingHorizontal: APP_SPACING.md,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: APP_COLORS.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: APP_COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.text,
    paddingVertical: APP_SPACING.sm,
  },
  iconLeft: {
    marginRight: APP_SPACING.sm,
  },
  iconRight: {
    marginLeft: APP_SPACING.sm,
  },
  error: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.error,
    marginTop: APP_SPACING.xs,
  },
});
