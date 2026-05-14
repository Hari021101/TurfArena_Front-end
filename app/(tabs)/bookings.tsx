import BookingCard from "@/components/ui/BookingCard";
import { APP_COLORS, APP_FONT_SIZES, APP_SPACING } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { getUserBookings } from "@/services/booking.service";
import { Booking } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      // Mock dummy data for demo
      const dummyBookings: Booking[] = [
        {
          id: "bk-101",
          userId: user.id,
          turfId: "turf-1",
          turfName: "Greenfield Arena",
          turfPhoto: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000",
          date: new Date().toISOString().split("T")[0],
          slots: ["18:00 - 19:00", "19:00 - 20:00"],
          totalAmount: 2400,
          paymentStatus: "completed",
          status: "confirmed",
          createdAt: new Date(),
        },
        {
          id: "bk-102",
          userId: user.id,
          turfId: "turf-2",
          turfName: "Urban Kick Turf",
          turfPhoto: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000",
          date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], // 2 days ago
          slots: ["07:00 - 08:00"],
          totalAmount: 1000,
          paymentStatus: "completed",
          status: "completed",
          createdAt: new Date(Date.now() - 86400000 * 5),
        }
      ];
      setTimeout(() => setBookings(dummyBookings), 800); // Simulate network delay
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              router.push({
                pathname: "/booking-details",
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={APP_COLORS.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={60}
                color={APP_COLORS.textTertiary}
              />
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubText}>
                Your booking history will appear here
              </Text>
            </View>
          ) : (
            <ActivityIndicator
              size="large"
              color={APP_COLORS.primary}
              style={{ marginTop: 50 }}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  header: {
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  headerTitle: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  listContent: {
    padding: APP_SPACING.lg,
    paddingBottom: APP_SPACING.xxxl,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.textSecondary,
    marginTop: APP_SPACING.md,
  },
  emptySubText: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textTertiary,
    marginTop: 4,
  },
});
