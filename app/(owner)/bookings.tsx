import BookingCard from "@/components/ui/BookingCard";
import { APP_FONT_SIZES, APP_SPACING, getColors } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getOwnerBookings } from "@/services/booking.service";
import { Booking } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OwnerBookingsScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const data = await getOwnerBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [user?.id]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Arena Bookings</Text>
        <Text style={styles.subtitle}>Manage your upcoming matches</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
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
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="calendar-outline"
                size={80}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyText}>
                No bookings found for your turfs.
              </Text>
              <Text style={styles.emptySubtext}>
                Upcoming bookings will appear here once players start booking
                your arenas.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: APP_SPACING.lg,
    },
    title: {
      fontSize: APP_FONT_SIZES.xxl,
      fontWeight: "bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: APP_SPACING.xl,
    },
    emptyText: {
      color: colors.text,
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      marginTop: APP_SPACING.md,
      textAlign: "center",
    },
    emptySubtext: {
      color: colors.textSecondary,
      fontSize: APP_FONT_SIZES.md,
      marginTop: APP_SPACING.sm,
      textAlign: "center",
      lineHeight: 22,
    },
    listContent: {
      paddingBottom: APP_SPACING.xxl,
    },
  });
