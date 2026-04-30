import Button from "@/components/ui/Button";
import SlotGrid from "@/components/ui/SlotGrid";
import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getSlotsByDate } from "@/services/booking.service";
import { getTurfById } from "@/services/turf.service";
import { Turf } from "@/types";
import {
    formatDateWithLabel,
    generateTimeSlots,
    getNextDays,
    toDateString,
} from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const [turf, setTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const dates = getNextDays(14);

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

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "Please login to book slots at this turf.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") },
        ],
      );
      return;
    }

    if (!turf || selectedSlots.length === 0) return;

    router.push({
      pathname: "/booking-summary",
      params: {
        turfId: turf.id,
        date: toDateString(selectedDate),
        slots: JSON.stringify(selectedSlots),
      },
    });
  };

  if (loading && !turf) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!turf) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load turf details.</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  const allSlots = generateTimeSlots(
    parseInt(turf.timing.start.split(":")[0] || "6"),
    parseInt(turf.timing.end.split(":")[0] || "23"),
  );

  const morningSlots = allSlots.filter((slot) => {
    const hour = parseInt(slot.split(":")[0]);
    return hour < 12;
  });

  const afternoonSlots = allSlots.filter((slot) => {
    const hour = parseInt(slot.split(":")[0]);
    return hour >= 12 && hour < 16;
  });

  const eveningSlots = allSlots.filter((slot) => {
    const hour = parseInt(slot.split(":")[0]);
    return hour >= 16;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Slots</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>
            {format(selectedDate, "MMMM yyyy")}
          </Text>
        </View>
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

        {allSlots.length === 0 && (
          <View style={styles.emptySlotsContainer}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={colors.textTertiary}
            />
            <Text style={styles.emptySlotsText}>
              No slots available for this date. The turf might be closed.
            </Text>
          </View>
        )}

        {morningSlots.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="sunny-outline" size={18} color={colors.accent} />
              <Text style={styles.sectionTitle}>Morning Slots</Text>
            </View>
            <SlotGrid
              slots={morningSlots}
              bookedSlots={bookedSlots}
              selectedSlots={selectedSlots}
              onToggleSlot={toggleSlot}
              loading={loading}
              selectedDate={selectedDate}
            />
          </>
        )}

        {afternoonSlots.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="sunny" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Afternoon Slots</Text>
            </View>
            <SlotGrid
              slots={afternoonSlots}
              bookedSlots={bookedSlots}
              selectedSlots={selectedSlots}
              onToggleSlot={toggleSlot}
              loading={loading}
              selectedDate={selectedDate}
            />
          </>
        )}

        {eveningSlots.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="moon-outline"
                size={18}
                color={colors.secondary}
              />
              <Text style={styles.sectionTitle}>Evening / Night Slots</Text>
            </View>
            <SlotGrid
              slots={eveningSlots}
              bookedSlots={bookedSlots}
              selectedSlots={selectedSlots}
              onToggleSlot={toggleSlot}
              loading={loading}
              selectedDate={selectedDate}
            />
          </>
        )}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendBox, { backgroundColor: colors.card }]}
            />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendBox, { backgroundColor: colors.primary }]}
            />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor: colors.primary + "40",
                  borderColor: colors.error,
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
          title="Proceed"
          variant="primary"
          size="large"
          onPress={handleConfirmBooking}
          disabled={selectedSlots.length === 0}
          style={styles.confirmButton}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
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
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.white,
    },
    scrollContent: {
      paddingHorizontal: APP_SPACING.lg,
      paddingBottom: 150,
    },
    monthHeader: {
      marginTop: APP_SPACING.md,
      marginBottom: APP_SPACING.xs,
    },
    monthText: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.primary,
    },
    dateList: {
      flexDirection: "row",
    },
    dateItem: {
      width: 60,
      height: 80,
      backgroundColor: colors.card,
      borderRadius: APP_BORDER_RADIUS.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: APP_SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateItemActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    dateText: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    dayText: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.white,
    },
    dateTextActive: {
      color: colors.white,
    },
    dayTextActive: {
      color: colors.white,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: APP_SPACING.xl,
      marginBottom: APP_SPACING.md,
      gap: 8,
    },
    sectionTitle: {
      fontSize: APP_FONT_SIZES.md,
      fontWeight: "bold",
      color: colors.white,
    },
    legend: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: APP_SPACING.xl,
      paddingVertical: APP_SPACING.md,
      backgroundColor: colors.card,
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
      color: colors.textSecondary,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      padding: APP_SPACING.lg,
      paddingBottom: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalValue: {
      fontSize: APP_FONT_SIZES.md,
      fontWeight: "700",
      color: colors.white,
    },
    totalLabel: {
      fontSize: APP_FONT_SIZES.lg,
      color: colors.primary,
      fontWeight: "bold",
      marginTop: 2,
    },
    confirmButton: {
      flex: 1,
      marginLeft: APP_SPACING.xl,
    },
    emptySlotsContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: APP_SPACING.xxxl,
      marginTop: APP_SPACING.xl,
    },
    emptySlotsText: {
      color: colors.textSecondary,
      fontSize: APP_FONT_SIZES.md,
      textAlign: "center",
      marginTop: APP_SPACING.md,
      paddingHorizontal: APP_SPACING.xl,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: APP_SPACING.xl,
    },
    errorText: {
      color: colors.white,
      fontSize: APP_FONT_SIZES.md,
      textAlign: "center",
      marginBottom: APP_SPACING.lg,
    },
  });
