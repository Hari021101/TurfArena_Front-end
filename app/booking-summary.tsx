import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { createBooking } from "@/services/booking.service";
import { getTurfById } from "@/services/turf.service";
import { Turf } from "@/types";
import { formatTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSummaryScreen() {
  const params = useLocalSearchParams<{
    turfId: string;
    date: string;
    slots: string;
  }>();

  const { user } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");

  const selectedSlots: string[] = params.slots ? JSON.parse(params.slots) : [];
  const basePrice = (turf?.pricePerHour || 0) * selectedSlots.length;
  const convenienceFee = 20;
  const totalAmount = basePrice + convenienceFee;

  useEffect(() => {
    const fetchTurf = async () => {
      if (!params.turfId) return;
      try {
        const data = await getTurfById(params.turfId);
        setTurf(data);
      } catch (error) {
        console.error("Error fetching turf:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [params.turfId]);

  const handlePayNow = async () => {
    if (!user || !turf) {
      Alert.alert("Error", "Missing user or turf details.");
      return;
    }

    setShowPaymentModal(true);
    setPaymentStatus("processing");

    // Simulate Payment Processing for 2 seconds
    setTimeout(async () => {
      setPaymentStatus("success");

      // After success animation, create the booking
      setTimeout(async () => {
        try {
          const bookingId = await createBooking({
            userId: user.id,
            turfId: turf.id,
            turfName: turf.name,
            turfPhoto: turf.photos[0],
            date: params.date,
            slots: selectedSlots,
            totalAmount: totalAmount,
            status: "confirmed",
            paymentStatus: "completed",
          });

          setShowPaymentModal(false);
          router.replace({
            pathname: "/booking-success",
            params: { bookingId },
          });
        } catch (error) {
          console.error("Booking failed:", error);
          setShowPaymentModal(false);
          Alert.alert("Booking failed", "Please try again later.");
        }
      }, 1500);
    }, 2500);
  };

  if (loading || !turf) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Turf Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Turf Details</Text>
          <Card variant="elevated" style={styles.turfCard}>
            <View style={styles.turfRow}>
              <Image
                source={{ uri: turf.photos[0] }}
                style={styles.turfImage}
              />
              <View style={styles.turfDetails}>
                <Text style={styles.turfName}>{turf.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.locationText}>
                    {turf.location.address}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Selected Slots Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time & Date</Text>
          <Card variant="outlined" style={styles.dateSlotCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.infoValue}>{params.date}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.slotsContainer}>
              {selectedSlots.map((slot, index) => (
                <View key={index} style={styles.slotItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.slotText}>
                    {formatTime(slot.split(" - ")[0])} -{" "}
                    {formatTime(slot.split(" - ")[1])}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Card variant="outlined" style={styles.userCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.infoValue}>{user?.name || "Guest"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={colors.primary} />
              <Text style={styles.infoValue}>
                {user?.phone || "+91 99999 99999"}
              </Text>
            </View>
          </Card>
        </View>

        {/* Price Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <Card variant="elevated" style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Base Amount ({selectedSlots.length} slots)
              </Text>
              <Text style={styles.priceValue}>₹{basePrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Convenience Fee</Text>
              <Text style={styles.priceValue}>₹{convenienceFee}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{totalAmount}</Text>
            </View>
          </Card>
        </View>

        <View style={styles.secureNote}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.secureText}>Secure SSL Encrypted Payment</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Grand Total</Text>
          <Text style={styles.footerPrice}>₹{totalAmount}</Text>
        </View>
        <Button
          title="Proceed to Pay"
          variant="primary"
          size="large"
          onPress={handlePayNow}
          style={styles.payButton}
        />
      </View>

      {/* Premium Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {paymentStatus === "processing" ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.modalTitle}>Processing Payment</Text>
                <Text style={styles.modalSubtitle}>
                  Please do not close the app or press back
                </Text>
              </>
            ) : (
              <>
                <View style={styles.successIcon}>
                  <Ionicons
                    name="checkmark-circle"
                    size={80}
                    color={colors.success}
                  />
                </View>
                <Text style={styles.modalTitle}>Payment Successful!</Text>
                <Text style={styles.modalSubtitle}>
                  Your booking is being confirmed...
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    section: {
      marginTop: APP_SPACING.xl,
    },
    sectionTitle: {
      fontSize: APP_FONT_SIZES.md,
      fontWeight: "bold",
      color: colors.white,
      marginBottom: APP_SPACING.md,
    },
    turfCard: {
      padding: APP_SPACING.md,
    },
    turfRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    turfImage: {
      width: 70,
      height: 70,
      borderRadius: APP_BORDER_RADIUS.md,
    },
    turfDetails: {
      marginLeft: APP_SPACING.md,
      flex: 1,
    },
    turfName: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.white,
      marginBottom: 4,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    locationText: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    dateSlotCard: {
      padding: APP_SPACING.md,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
    },
    infoValue: {
      fontSize: APP_FONT_SIZES.md,
      color: colors.white,
      fontWeight: "600",
      marginLeft: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: APP_SPACING.md,
    },
    slotsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    slotItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    slotText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 6,
      fontWeight: "600",
    },
    userCard: {
      padding: APP_SPACING.md,
    },
    priceCard: {
      padding: APP_SPACING.md,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: APP_SPACING.sm,
    },
    priceLabel: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
    },
    priceValue: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.white,
      fontWeight: "600",
    },
    priceDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: APP_SPACING.md,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalLabel: {
      fontSize: APP_FONT_SIZES.md,
      fontWeight: "bold",
      color: colors.white,
    },
    totalValue: {
      fontSize: APP_FONT_SIZES.xl,
      fontWeight: "heavy",
      color: colors.primary,
    },
    secureNote: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: APP_SPACING.xl,
    },
    secureText: {
      fontSize: 10,
      color: colors.success,
      marginLeft: 6,
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: "700",
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
    footerLabel: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    footerPrice: {
      fontSize: APP_FONT_SIZES.xl,
      fontWeight: "bold",
      color: colors.white,
      marginTop: 2,
    },
    payButton: {
      flex: 1,
      marginLeft: APP_SPACING.xl,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "80%",
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.white,
      marginTop: 20,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 10,
    },
    successIcon: {
      marginBottom: 10,
    },
  });
