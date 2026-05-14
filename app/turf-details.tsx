import Button from "@/components/ui/Button";
import ReviewCard from "@/components/ui/ReviewCard";
import WeatherCard from "@/components/ui/WeatherCard";
import {
  APP_BORDER_RADIUS,
  APP_FONT_SIZES,
  APP_SHADOWS,
  APP_SPACING,
  getColors,
} from "@/constants/appTheme";
import { useTheme } from "@/context/ThemeContext";
import { getTurfReviews } from "@/services/review.service";
import { getTurfById } from "@/services/turf.service";
import { getTurfWeather } from "@/services/weather.service";
import { Review, Turf } from "@/types";
import { formatTurfTiming } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function TurfDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);
  const { isFavourite, toggleFavourite } = useAuth();
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleFavouritePress = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    if (turf) toggleFavourite(turf.id);
  };

  useEffect(() => {
    const fetchTurfData = async () => {
      if (!id) return;
      try {
        const [turfData, reviewData, weatherData] = await Promise.all([
          getTurfById(id),
          getTurfReviews(id),
          getTurfWeather(id),
        ]);
        setTurf(turfData);
        setReviews(reviewData);
        setWeather(weatherData);
      } catch (error) {
        console.error("Error fetching turf data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          {/* ❤️ Favourite Button */}
          <TouchableOpacity
            style={styles.heartButtonDetail}
            onPress={handleFavouritePress}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={turf && isFavourite(turf.id) ? "heart" : "heart-outline"}
                size={24}
                color={turf && isFavourite(turf.id) ? "#F43F5E" : "rgba(255,255,255,0.9)"}
              />
            </Animated.View>
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
                  color={colors.textSecondary}
                />
                <Text style={styles.locationText}>{turf.location.address}</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.ratingText}>{turf.rating || "4.5"}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
              <Text style={styles.statLabel}>Timing</Text>
              <Text style={styles.statValue}>
                {formatTurfTiming(turf.timing)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={22} color={colors.primary} />
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.statValue}>₹{turf.pricePerHour}/hr</Text>
            </View>
          </View>

          {turf.sportTypes && turf.sportTypes.length > 0 && (
            <View style={styles.sportBadgesRow}>
              {turf.sportTypes.map((sport, index) => (
                <View key={index} style={styles.sportBadgeLarge}>
                  <Text style={styles.sportBadgeTextLarge}>{sport}</Text>
                </View>
              ))}
            </View>
          )}

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

          {/* 🌤️ Weather Widget */}
          {weather && (
            <>
              <Text style={styles.sectionTitle}>Today's Weather</Text>
              <WeatherCard
                weather={weather}
                isOutdoor={
                  !turf.amenities.some((a) =>
                    a.toLowerCase().includes("indoor") ||
                    a.toLowerCase().includes("ac hall")
                  )
                }
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
          {reviews.length > 0 ? (
            reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
          ) : (
            <View style={styles.emptyReviews}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={44}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyReviewsText}>
                No reviews yet. Be the first to rate!
              </Text>
            </View>
          )}

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
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: APP_SPACING.xl,
    },
    errorText: {
      color: colors.text,
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
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      ...APP_SHADOWS.small,
    },
    heartButtonDetail: {
      position: "absolute",
      top: 50,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      ...APP_SHADOWS.small,
    },
    detailsContainer: {
      padding: APP_SPACING.lg,
      backgroundColor: colors.background,
      borderTopLeftRadius: APP_BORDER_RADIUS.xl,
      borderTopRightRadius: APP_BORDER_RADIUS.xl,
      marginTop: -APP_SPACING.xl,
      ...APP_SHADOWS.medium,
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
      color: colors.text,
      marginBottom: 4,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    locationText: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: APP_SPACING.sm,
      paddingVertical: 6,
      borderRadius: APP_BORDER_RADIUS.md,
      ...APP_SHADOWS.small,
    },
    ratingText: {
      color: colors.text,
      fontWeight: "bold",
      marginLeft: 4,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: APP_BORDER_RADIUS.lg,
      padding: APP_SPACING.md,
      marginBottom: APP_SPACING.lg,
      justifyContent: "space-around",
      alignItems: "center",
      ...APP_SHADOWS.small,
    },
    statItem: {
      alignItems: "center",
    },
    statLabel: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
      marginTop: 4,
    },
    statValue: {
      fontSize: APP_FONT_SIZES.sm,
      fontWeight: "700",
      color: colors.text,
      marginTop: 2,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: colors.divider,
    },
    sportBadgesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: APP_SPACING.md,
    },
    sportBadgeLarge: {
      backgroundColor: colors.primaryTransparent,
      paddingHorizontal: APP_SPACING.md,
      paddingVertical: 6,
      borderRadius: APP_BORDER_RADIUS.md,
      marginRight: APP_SPACING.sm,
      marginBottom: APP_SPACING.sm,
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    sportBadgeTextLarge: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.primary,
      textTransform: "uppercase",
    },
    sectionTitle: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: APP_SPACING.sm,
      marginTop: APP_SPACING.md,
    },
    descriptionText: {
      fontSize: APP_FONT_SIZES.md,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    amenitiesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: APP_SPACING.xs,
    },
    amenityBadge: {
      backgroundColor: colors.card,
      paddingHorizontal: APP_SPACING.md,
      paddingVertical: APP_SPACING.sm,
      borderRadius: APP_BORDER_RADIUS.round,
      marginRight: APP_SPACING.sm,
      marginBottom: APP_SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    amenityText: {
      color: colors.textSecondary,
      fontSize: APP_FONT_SIZES.xs,
      fontWeight: "600",
    },
    bookingCard: {
      position: "relative",
      marginTop: APP_SPACING.xl,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: APP_SPACING.lg,
      borderRadius: APP_BORDER_RADIUS.lg,
      borderColor: colors.border,
      borderWidth: 1,
      ...APP_SHADOWS.medium,
    },
    bookingPrice: {
      fontSize: APP_FONT_SIZES.xxl,
      fontWeight: "bold",
      color: colors.primary,
    },
    bookingPriceLabel: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
    },
    bookButton: {
      flex: 1,
      marginLeft: APP_SPACING.xl,
    },
    emptyReviews: {
      alignItems: "center",
      padding: APP_SPACING.xl,
      backgroundColor: colors.card,
      borderRadius: APP_BORDER_RADIUS.lg,
      marginTop: APP_SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyReviewsText: {
      color: colors.textSecondary,
      fontSize: APP_FONT_SIZES.sm,
      marginTop: APP_SPACING.sm,
      textAlign: "center",
    },
  });
