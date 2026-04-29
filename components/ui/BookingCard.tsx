import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { Booking } from "@/types";
import { formatDateWithLabel } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import Card from "./Card";

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  style?: ViewStyle;
}

export default function BookingCard({
  booking,
  onPress,
  style,
}: BookingCardProps) {
  const getStatusColor = () => {
    switch (booking.status) {
      case "confirmed":
        return APP_COLORS.success;
      case "cancelled":
        return APP_COLORS.error;
      case "completed":
        return APP_COLORS.info;
      default:
        return APP_COLORS.textSecondary;
    }
  };

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        <Image
          source={{
            uri:
              booking.turfPhoto || "https://via.placeholder.com/100?text=Turf",
          }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={styles.turfName} numberOfLines={1}>
              {booking.turfName || "Turf Arena"}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() + "20" },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {booking.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={APP_COLORS.textSecondary}
            />
            <Text style={styles.infoText}>
              {formatDateWithLabel(booking.date)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={APP_COLORS.textSecondary}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {booking.slots.length} Slots: {booking.slots.join(", ")}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.amount}>₹{booking.totalAmount}</Text>
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: APP_SPACING.md,
  },
  content: {
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: APP_BORDER_RADIUS.md,
    backgroundColor: APP_COLORS.cardLight,
  },
  details: {
    flex: 1,
    marginLeft: APP_SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  turfName: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.white,
    flex: 1,
    marginRight: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  infoText: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: APP_SPACING.sm,
  },
  amount: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.primary,
  },
  viewDetails: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.secondary,
    fontWeight: "600",
  },
});
