import Button from "@/components/ui/Button";
import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { getTurfById } from "@/services/turf.service";
import { Turf } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TurfDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfDetails = async () => {
      if (!id) return;
      try {
        const data = await getTurfById(id);
        setTurf(data);
      } catch (error) {
        console.error("Error fetching turf details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
      </View>
    );
  }

  if (!turf) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Turf not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: turf.photos[0] }} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={APP_COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>{turf.name}</Text>
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={APP_COLORS.textSecondary}
                />
                <Text style={styles.locationText}>
                  {turf.location.address}, {turf.location.city}
                </Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={APP_COLORS.accent} />
              <Text style={styles.ratingText}>{turf.rating || "4.5"}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color={APP_COLORS.primary}
              />
              <Text style={styles.statLabel}>Timing</Text>
              <Text style={styles.statValue}>
                {turf.timing.start} - {turf.timing.end}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={APP_COLORS.primary}
              />
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.statValue}>₹{turf.pricePerHour}/hr</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{turf.description}</Text>

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {turf.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityBadge}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bookingCard}>
            <View>
              <Text style={styles.bookingPrice}>₹{turf.pricePerHour}</Text>
              <Text style={styles.bookingPriceLabel}>per hour</Text>
            </View>
            <Button
              title="Book a Slot"
              variant="primary"
              size="large"
              onPress={() =>
                router.push({
                  pathname: "/select-slots",
                  params: { turfId: turf.id },
                })
              }
              style={styles.bookButton}
            />
          </View>
        </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: 250,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    padding: APP_SPACING.lg,
    backgroundColor: APP_COLORS.background,
    borderTopLeftRadius: APP_BORDER_RADIUS.xl,
    borderTopRightRadius: APP_BORDER_RADIUS.xl,
    marginTop: -APP_SPACING.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: APP_SPACING.lg,
  },
  name: {
    fontSize: APP_FONT_SIZES.xxl,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    marginLeft: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: APP_COLORS.card,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 4,
    borderRadius: APP_BORDER_RADIUS.md,
  },
  ratingText: {
    color: APP_COLORS.white,
    fontWeight: "bold",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.lg,
    padding: APP_SPACING.md,
    marginBottom: APP_SPACING.lg,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    marginTop: 4,
  },
  statValue: {
    fontSize: APP_FONT_SIZES.sm,
    fontWeight: "700",
    color: APP_COLORS.white,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: APP_COLORS.border,
  },
  sectionTitle: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginBottom: APP_SPACING.sm,
    marginTop: APP_SPACING.md,
  },
  descriptionText: {
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.textSecondary,
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: APP_SPACING.xs,
  },
  amenityBadge: {
    backgroundColor: APP_COLORS.card,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderRadius: APP_BORDER_RADIUS.round,
    marginRight: APP_SPACING.sm,
    marginBottom: APP_SPACING.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  amenityText: {
    color: APP_COLORS.textSecondary,
    fontSize: APP_FONT_SIZES.xs,
    fontWeight: "600",
  },
  bookingCard: {
    position: "absolute",
    bottom: -100, // Fixed at bottom of screen usually, but adjusted for ScrollView padding
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: APP_COLORS.card,
    padding: APP_SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    paddingBottom: 40,
  },
  bookingPrice: {
    fontSize: APP_FONT_SIZES.xxl,
    fontWeight: "bold",
    color: APP_COLORS.primary,
  },
  bookingPriceLabel: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
  },
  bookButton: {
    flex: 1,
    marginLeft: APP_SPACING.xl,
  },
});
