import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { APP_COLORS, APP_FONT_SIZES, APP_SPACING } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { addReview } from "@/services/review.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddReviewScreen() {
  const {
    id: bookingId,
    turfId,
    turfName,
  } = useLocalSearchParams<{
    id: string;
    turfId: string;
    turfName: string;
  }>();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    if (!user || !bookingId || !turfId) return;

    setLoading(true);
    try {
      await addReview({
        userId: user.id,
        userName: user.name,
        userPhoto: user.profilePicture,
        turfId,
        bookingId,
        rating,
        comment,
      });

      Alert.alert("Success", "Thank you for your feedback!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={44}
              color={
                star <= rating ? APP_COLORS.accent : APP_COLORS.textTertiary
              }
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={24} color={APP_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Your Experience</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.turfInfo}>
            <Text style={styles.turfLabel}>How was your session at</Text>
            <Text style={styles.turfName}>{turfName || "the arena"}?</Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.sectionLabel}>Tap stars to rate</Text>
            {renderStars()}
            <Text style={styles.ratingText}>
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent!"}
            </Text>
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.sectionLabel}>Write a comment (optional)</Text>
            <Input
              placeholder="What did you like or what could be improved?"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              style={styles.commentInput}
            />
          </View>

          <Button
            title={loading ? "Submitting..." : "Submit Review"}
            onPress={handleSubmit}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={loading || rating === 0}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: APP_SPACING.lg,
    alignItems: "center",
  },
  turfInfo: {
    alignItems: "center",
    marginBottom: APP_SPACING.xxl,
  },
  turfLabel: {
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.textSecondary,
    marginBottom: 4,
  },
  turfName: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    color: APP_COLORS.primary,
    textAlign: "center",
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: APP_SPACING.xxl,
    width: "100%",
  },
  sectionLabel: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.md,
    width: "100%",
    textAlign: "left",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: APP_SPACING.sm,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "600",
    color: APP_COLORS.white,
    marginTop: APP_SPACING.sm,
  },
  commentSection: {
    width: "100%",
    marginBottom: APP_SPACING.xxl,
  },
  commentInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: APP_SPACING.md,
  },
  submitButton: {
    marginTop: APP_SPACING.md,
  },
});
