import Button from "@/components/ui/Button";
import SlotGrid from "@/components/ui/SlotGrid";
import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { createBooking, getSlotsByDate } from "@/services/booking.service";
import { getTurfById } from "@/services/turf.service";
import { Turf } from "@/types";
import {
    formatDateWithLabel,
    generateTimeSlots,
    toDateString,
} from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectSlotsScreen() {
  const { turfId } = useLocalSearchParams<{ turfId: string }>();
  const { user } = useAuth();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!turfId) return;
      try {
        const turfData = await getTurfById(turfId);
        setTurf(turfData);

        const slots = await getSlotsByDate(turfId, toDateString(selectedDate));
        setBookedSlots(
          slots.filter((s) => s.status === "booked").map((s) => s.time),
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [turfId, selectedDate]);

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !turf || selectedSlots.length === 0) return;

    setBookingLoading(true);
    try {
      const bookingId = await createBooking({
        userId: user.id,
        turfId: turf.id,
        turfName: turf.name,
        turfPhoto: turf.photos[0],
        date: toDateString(selectedDate),
        slots: selectedSlots,
        totalAmount: turf.pricePerHour * selectedSlots.length,
        status: "confirmed",
        paymentStatus: "pending",
      });

      router.replace({
        pathname: "/booking-success",
        params: { bookingId },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading && !turf) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
      </View>
    );
  }

  const allSlots = generateTimeSlots(
    parseInt(turf?.timing.start.split(":")[0] || "6"),
    parseInt(turf?.timing.end.split(":")[0] || "23"),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={APP_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Slots</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateList}
        >
          {dates.map((date, index) => {
            const isSelected =
              toDateString(date) === toDateString(selectedDate);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateItem, isSelected && styles.dateItemActive]}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedSlots([]);
                }}
              >
                <Text
                  style={[styles.dateText, isSelected && styles.dateTextActive]}
                >
                  {formatDateWithLabel(date).split(",")[0]}
                </Text>
                <Text
                  style={[styles.dayText, isSelected && styles.dayTextActive]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.slotHeader}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <Text style={styles.priceInfo}>₹{turf?.pricePerHour}/hr</Text>
        </View>

        <SlotGrid
          slots={allSlots}
          bookedSlots={bookedSlots}
          selectedSlots={selectedSlots}
          onToggleSlot={toggleSlot}
          loading={loading}
        />

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendBox, { backgroundColor: APP_COLORS.card }]}
            />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: APP_COLORS.primary },
              ]}
            />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor: APP_COLORS.slotBooked + "40",
                  borderColor: APP_COLORS.error,
                  borderWidth: 1,
                },
              ]}
            />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalValue}>
            {selectedSlots.length} Slots Selected
          </Text>
          <Text style={styles.totalLabel}>
            Total: ₹{(turf?.pricePerHour || 0) * selectedSlots.length}
          </Text>
        </View>
        <Button
          title={bookingLoading ? "Processing..." : "Confirm"}
          variant="primary"
          size="large"
          onPress={handleConfirmBooking}
          disabled={selectedSlots.length === 0 || bookingLoading}
          loading={bookingLoading}
          style={styles.confirmButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: APP_COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: APP_SPACING.lg,
    paddingBottom: 150,
  },
  sectionTitle: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "700",
    color: APP_COLORS.white,
    marginTop: APP_SPACING.lg,
    marginBottom: APP_SPACING.md,
  },
  dateList: {
    flexDirection: "row",
  },
  dateItem: {
    width: 60,
    height: 80,
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: APP_SPACING.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  dateItemActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  dateText: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    marginBottom: 4,
  },
  dayText: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  dateTextActive: {
    color: APP_COLORS.white,
  },
  dayTextActive: {
    color: APP_COLORS.white,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: APP_SPACING.md,
  },
  priceInfo: {
    color: APP_COLORS.primary,
    fontWeight: "bold",
    marginTop: APP_SPACING.md,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: APP_SPACING.xl,
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: APP_COLORS.card,
    padding: APP_SPACING.lg,
    paddingBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
  },
  totalValue: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "700",
    color: APP_COLORS.white,
  },
  totalLabel: {
    fontSize: APP_FONT_SIZES.lg,
    color: APP_COLORS.primary,
    fontWeight: "bold",
    marginTop: 2,
  },
  confirmButton: {
    flex: 1,
    marginLeft: APP_SPACING.xl,
  },
});
