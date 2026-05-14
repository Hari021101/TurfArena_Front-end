import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SHADOWS,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Turf } from "@/types";
import { formatTurfTiming } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import Card from "./Card";

interface TurfCardProps {
  turf: Turf;
  onPress: () => void;
  style?: ViewStyle;
}

export default function TurfCard({ turf, onPress, style }: TurfCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);
  const { isFavourite, toggleFavourite } = useAuth();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const favourite = isFavourite(turf.id);

  const handleFavouritePress = () => {
    // Pulse animation
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.35, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    toggleFavourite(turf.id);
  };

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      noPadding
      style={[styles.container, style] as any}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri:
              turf.photos[0] ||
              "https://via.placeholder.com/300x150?text=No+Image",
          }}
          style={styles.image}
        />
        {/* ❤️ Favourite Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleFavouritePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={favourite ? "heart" : "heart-outline"}
              size={22}
              color={favourite ? "#F43F5E" : "rgba(255,255,255,0.9)"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {turf.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{turf.rating || "N/A"}</Text>
          </View>
        </View>

        {turf.sportTypes && turf.sportTypes.length > 0 && (
          <View style={styles.sportBadge}>
            <Text style={styles.sportBadgeText}>{turf.sportTypes[0]}</Text>
          </View>
        )}

        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textSecondary}
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
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.timeText}>{formatTurfTiming(turf.timing)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: APP_SPACING.md,
      overflow: "hidden",
      backgroundColor: colors.card,
    },
    imageWrapper: {
      position: "relative",
    },
    image: {
      width: "100%",
      height: 180,
      backgroundColor: colors.cardLight,
    },
    heartButton: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
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
      color: colors.text,
      flex: 1,
      marginRight: APP_SPACING.sm,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: APP_SPACING.sm,
      paddingVertical: 4,
      borderRadius: APP_BORDER_RADIUS.sm,
      ...APP_SHADOWS.small,
    },
    ratingText: {
      fontSize: APP_FONT_SIZES.xs,
      fontWeight: "bold",
      color: colors.text,
      marginLeft: 4,
    },
    sportBadge: {
      backgroundColor: colors.primaryTransparent,
      paddingHorizontal: APP_SPACING.sm,
      paddingVertical: 2,
      borderRadius: APP_BORDER_RADIUS.xs,
      alignSelf: "flex-start",
      marginBottom: APP_SPACING.sm,
      borderWidth: 1,
      borderColor: colors.primary + "40",
    },
    sportBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      color: colors.primary,
      textTransform: "uppercase",
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: APP_SPACING.md,
    },
    locationText: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
      marginLeft: 4,
      flex: 1,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: APP_SPACING.sm,
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    priceText: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.primary,
    },
    unitText: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
      marginLeft: 2,
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeText: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

