import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { Turf } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import Card from "./Card";

interface TurfCardProps {
  turf: Turf;
  onPress: () => void;
  style?: ViewStyle;
}

export default function TurfCard({ turf, onPress, style }: TurfCardProps) {
  return (
    <Card
      variant="elevated"
      onPress={onPress}
      noPadding
      style={[styles.container, style] as any}
    >
      <Image
        source={{
          uri:
            turf.photos[0] ||
            "https://via.placeholder.com/300x150?text=No+Image",
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {turf.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={APP_COLORS.accent} />
            <Text style={styles.ratingText}>{turf.rating || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={14}
            color={APP_COLORS.textSecondary}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {turf.location.address}, {turf.location.city}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{turf.pricePerHour}</Text>
            <Text style={styles.unitText}>/hr</Text>
          </View>
          <View style={styles.timeContainer}>
            <Ionicons
              name="time-outline"
              size={14}
              color={APP_COLORS.primary}
            />
            <Text style={styles.timeText}>
              {turf.timing.start} - {turf.timing.end}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: APP_SPACING.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: APP_COLORS.cardLight,
  },
  content: {
    padding: APP_SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: APP_SPACING.xs,
  },
  name: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "700",
    color: APP_COLORS.white,
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: APP_COLORS.background,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 2,
    borderRadius: APP_BORDER_RADIUS.sm,
  },
  ratingText: {
    fontSize: APP_FONT_SIZES.xs,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: APP_SPACING.md,
  },
  locationText: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    paddingTop: APP_SPACING.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.primary,
  },
  unitText: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    marginLeft: 2,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    marginLeft: 4,
  },
});
