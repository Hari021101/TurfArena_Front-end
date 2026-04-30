import { APP_FONT_SIZES, APP_SPACING, getColors } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getOwnerBookings } from "@/services/booking.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OwnerEarningsScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    bookingsCount: 0,
  });

  const fetchStats = async () => {
    if (!user) return;
    try {
      const bookings = await getOwnerBookings(user.id);
      const activeBookings = bookings.filter((b) => b.status !== "cancelled");

      const totalRevenue = activeBookings.reduce(
        (sum, b) => sum + b.totalAmount,
        0,
      );

      setStats({
        revenue: totalRevenue,
        bookingsCount: activeBookings.length,
      });
    } catch (error) {
      console.error("Error fetching earnings stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [user?.id]),
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Earnings Overview</Text>
            <Text style={styles.subtitle}>
              Track your revenue and performance
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Revenue</Text>
              <Text style={styles.statValue}>₹{stats.revenue}</Text>
              <Text style={styles.statTrend}>Overall</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Bookings</Text>
              <Text style={styles.statValue}>{stats.bookingsCount}</Text>
              <Text style={styles.statTrend}>Lifetime</Text>
            </View>
          </View>

          <View style={styles.chartPlaceholder}>
            <Ionicons
              name="bar-chart-outline"
              size={48}
              color={colors.textTertiary}
            />
            <Text style={styles.placeholderText}>
              Revenue Chart Coming Soon
            </Text>
          </View>

          <View style={styles.recentTransactions}>
            <Text style={styles.sectionTitle}>Recent Payouts</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions yet.</Text>
            </View>
          </View>
        </ScrollView>
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
    scrollContent: {
      paddingBottom: 40,
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
    },
    statsGrid: {
      flexDirection: "row",
      paddingHorizontal: APP_SPACING.lg,
      gap: APP_SPACING.md,
      marginBottom: APP_SPACING.xl,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: APP_SPACING.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statLabel: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    statValue: {
      fontSize: APP_FONT_SIZES.xxl,
      fontWeight: "bold",
      color: colors.primary,
      marginVertical: 4,
    },
    statTrend: {
      fontSize: 10,
      color: colors.textTertiary,
    },
    chartPlaceholder: {
      height: 200,
      backgroundColor: colors.card,
      marginHorizontal: APP_SPACING.lg,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: APP_SPACING.xl,
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: colors.border,
    },
    placeholderText: {
      color: colors.textTertiary,
      marginTop: APP_SPACING.sm,
      fontSize: APP_FONT_SIZES.sm,
    },
    recentTransactions: {
      paddingHorizontal: APP_SPACING.lg,
    },
    sectionTitle: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: APP_SPACING.md,
    },
    emptyState: {
      padding: APP_SPACING.xl,
      alignItems: "center",
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: APP_FONT_SIZES.md,
    },
  });
