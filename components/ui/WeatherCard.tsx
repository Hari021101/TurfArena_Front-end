import { APP_BORDER_RADIUS, APP_FONT_SIZES, APP_SPACING, getColors } from "@/constants/appTheme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { WeatherData } from "@/services/weather.service";

interface WeatherCardProps {
  weather: WeatherData;
  isOutdoor: boolean;
}

export default function WeatherCard({ weather, isOutdoor }: WeatherCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const isRaining = weather.condition.toLowerCase().includes("rain");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
            source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }} 
            style={styles.icon} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.tempText}>{Math.round(weather.temp)}°C</Text>
          <Text style={styles.descText}>{weather.description}</Text>
        </View>
      </View>

      {isRaining && isOutdoor && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color={colors.error} />
          <Text style={styles.warningText}>
            Looks like rain! This is an outdoor turf, book at your own risk.
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: APP_BORDER_RADIUS.md,
    padding: APP_SPACING.md,
    marginBottom: APP_SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    marginLeft: APP_SPACING.sm,
  },
  tempText: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    color: colors.text,
  },
  descText: {
    fontSize: APP_FONT_SIZES.sm,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.error + "20",
    padding: APP_SPACING.sm,
    borderRadius: APP_BORDER_RADIUS.sm,
    marginTop: APP_SPACING.sm,
  },
  warningText: {
    color: colors.error,
    fontSize: APP_FONT_SIZES.xs,
    marginLeft: APP_SPACING.xs,
    flex: 1,
  }
});
