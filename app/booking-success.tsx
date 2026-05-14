import Button from "@/components/ui/Button";
import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { scheduleBookingReminders } from "@/services/notification.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccessScreen() {
  const { bookingId, turfName, bookingDate, slotTime } =
    useLocalSearchParams<{
      bookingId: string;
      turfName: string;
      bookingDate: string;
      slotTime: string;
    }>();

  useEffect(() => {
    // Prevent back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    // 🔔 Schedule booking reminders
    if (bookingId && turfName && bookingDate && slotTime) {
      scheduleBookingReminders(bookingId, turfName, bookingDate, slotTime);
    }

    return () => backHandler.remove();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={100}
            color={APP_COLORS.primary}
          />
        </View>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your slot has been successfully booked. You can find the details in
          your bookings.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.idLabel}>Booking ID</Text>
          <Text style={styles.idValue}>{bookingId}</Text>
        </View>

        <Button
          title="View My Bookings"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => router.replace("/(tabs)/bookings")}
          style={styles.button}
        />

        <Button
          title="Go to Home"
          variant="outline"
          size="large"
          fullWidth
          onPress={() => router.replace("/(tabs)")}
          style={styles.homeButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: APP_SPACING.xl,
  },
  iconContainer: {
    marginBottom: APP_SPACING.xl,
  },
  title: {
    fontSize: APP_FONT_SIZES.xxxl,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginBottom: APP_SPACING.md,
  },
  subtitle: {
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: APP_SPACING.xxl,
  },
  infoCard: {
    backgroundColor: APP_COLORS.card,
    width: "100%",
    padding: APP_SPACING.lg,
    borderRadius: APP_BORDER_RADIUS.lg,
    alignItems: "center",
    marginBottom: APP_SPACING.xxl,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  idLabel: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  idValue: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  button: {
    marginBottom: APP_SPACING.md,
  },
  homeButton: {
    borderColor: APP_COLORS.border,
  },
});
