import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { cancelBooking, getBookingById } from "@/services/booking.service";
import { Booking } from "@/types";
import { formatDateWithLabel, formatTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      try {
        const bookingData = await getBookingById(id);
        if (bookingData) {
          setBooking(bookingData);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = () => {
    if (!booking) return;

    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelBooking(booking.id);
              Alert.alert("Success", "Booking cancelled successfully");
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel booking");
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const isCancelled = booking.status === "cancelled";
  const isUpcoming = true; // Simplified for Phase 1

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={APP_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Booking Status</Text>
              <Text
                style={[
                  styles.statusValue,
                  {
                    color: isCancelled ? APP_COLORS.error : APP_COLORS.success,
                  },
                ]}
              >
                {booking.status.toUpperCase()}
              </Text>
            </View>
            <Ionicons
              name={isCancelled ? "close-circle" : "checkmark-circle"}
              size={40}
              color={isCancelled ? APP_COLORS.error : APP_COLORS.success}
            />
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Turf Information</Text>
          <View style={styles.turfInfo}>
            <Image
              source={{ uri: booking.turfPhoto }}
              style={styles.turfImage}
            />
            <View style={styles.turfDetails}>
              <Text style={styles.turfName}>{booking.turfName}</Text>
              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar"
                  size={16}
                  color={APP_COLORS.primary}
                />
                <Text style={styles.infoText}>
                  {formatDateWithLabel(booking.date)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Slots</Text>
          <View style={styles.slotsContainer}>
            {booking.slots.map((slot, index) => (
              <View key={index} style={styles.slotBadge}>
                <Text style={styles.slotText}>
                  {(() => {
                    const [start, end] = slot.split(" - ");
                    return `${formatTime(start)} - ${formatTime(end)}`;
                  })()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <Card variant="outlined" style={styles.paymentCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Amount</Text>
              <Text style={styles.priceValue}>₹{booking.totalAmount}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax & Fees</Text>
              <Text style={styles.priceValue}>₹0</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>₹{booking.totalAmount}</Text>
            </View>
          </Card>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            <Ionicons
              name="qr-code-outline"
              size={150}
              color={APP_COLORS.white}
            />
          </View>
          <Text style={styles.bookingId}>ID: {booking.id}</Text>
          <Text style={styles.qrNote}>Show this QR at the turf entrance</Text>
        </View>

        {!isCancelled && isUpcoming && (
          <Button
            title={cancelling ? "Cancelling..." : "Cancel Booking"}
            variant="outline"
            onPress={handleCancelBooking}
            style={styles.cancelButton}
            loading={cancelling}
            disabled={cancelling}
          />
        )}

        {booking.status === "completed" && (
          <Button
            title="Rate Your Experience"
            variant="primary"
            onPress={() =>
              router.push({
                pathname: "/add-review",
                params: {
                  id: booking.id,
                  turfId: booking.turfId,
                  turfName: booking.turfName,
                },
              })
            }
            style={styles.rateButton}
          />
        )}
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: APP_SPACING.xl,
  },
  errorText: {
    color: APP_COLORS.white,
    fontSize: APP_FONT_SIZES.lg,
    marginBottom: APP_SPACING.md,
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
    paddingBottom: APP_SPACING.xl,
  },
  statusCard: {
    marginBottom: APP_SPACING.lg,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    marginTop: 4,
  },
  section: {
    marginBottom: APP_SPACING.xl,
  },
  sectionTitle: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginBottom: APP_SPACING.md,
  },
  turfInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  turfImage: {
    width: 60,
    height: 60,
    borderRadius: APP_BORDER_RADIUS.md,
  },
  turfDetails: {
    marginLeft: APP_SPACING.md,
  },
  turfName: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    marginLeft: 6,
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  slotBadge: {
    backgroundColor: APP_COLORS.card,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderRadius: APP_BORDER_RADIUS.md,
    marginRight: APP_SPACING.sm,
    marginBottom: APP_SPACING.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  slotText: {
    color: APP_COLORS.white,
    fontSize: APP_FONT_SIZES.sm,
    fontWeight: "600",
  },
  paymentCard: {
    padding: APP_SPACING.md,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: APP_SPACING.sm,
  },
  priceLabel: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
  },
  priceValue: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.white,
    fontWeight: "600",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    paddingTop: APP_SPACING.md,
    marginTop: APP_SPACING.sm,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  totalValue: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.primary,
  },
  qrSection: {
    alignItems: "center",
    marginVertical: APP_SPACING.xl,
  },
  qrContainer: {
    backgroundColor: APP_COLORS.card,
    padding: APP_SPACING.xl,
    borderRadius: APP_BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  bookingId: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  qrNote: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textTertiary,
  },
  cancelButton: {
    borderColor: APP_COLORS.error,
    marginTop: APP_SPACING.md,
  },
  rateButton: {
    marginTop: APP_SPACING.md,
  },
});
