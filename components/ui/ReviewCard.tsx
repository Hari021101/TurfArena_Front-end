import { APP_COLORS, APP_FONT_SIZES, APP_SPACING } from "@/constants/appTheme";
import { Review } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const ratingStars = Array(5).fill(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userPhoto ? (
            <Image source={{ uri: review.userPhoto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name="person"
                size={20}
                color={APP_COLORS.textSecondary}
              />
            </View>
          )}
          <View>
            <Text style={styles.userName}>{review.userName || "User"}</Text>
            <Text style={styles.date}>
              {review.createdAt.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.ratingRow}>
          {ratingStars.map((_, index) => (
            <Ionicons
              key={index}
              name={index < review.rating ? "star" : "star-outline"}
              size={14}
              color={APP_COLORS.accent}
            />
          ))}
        </View>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.card,
    padding: APP_SPACING.md,
    borderRadius: 12,
    marginBottom: APP_SPACING.md,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: APP_SPACING.sm,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: APP_SPACING.sm,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: APP_SPACING.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  userName: {
    fontSize: APP_FONT_SIZES.sm,
    fontWeight: "600",
    color: APP_COLORS.white,
  },
  date: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textTertiary,
  },
  ratingRow: {
    flexDirection: "row",
  },
  comment: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    lineHeight: 20,
  },
});
