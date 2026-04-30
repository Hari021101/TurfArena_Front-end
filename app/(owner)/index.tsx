import Button from "@/components/ui/Button";
import TurfCard from "@/components/ui/TurfCard";
import { APP_FONT_SIZES, APP_SPACING, getColors } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getTurfsByOwner } from "@/services/turf.service";
import { Turf } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerTurfs = async () => {
    if (!user) return;
    try {
      const data = await getTurfsByOwner(user.id);
      setTurfs(data);
    } catch (error) {
      console.error("Error fetching owner turfs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerTurfs();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Turfs</Text>
          <Text style={styles.subtitle}>Manage your arena listings</Text>
        </View>
        <Button
          title="Add Turf"
          size="small"
          variant="primary"
          icon="add"
          onPress={() => router.push("/(owner)/add-turf")}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={turfs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TurfCard
              turf={item}
              onPress={() =>
                router.push({
                  pathname: "/turf-details",
                  params: { id: item.id },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="business-outline"
                size={60}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyText}>
                You haven't added any turfs yet.
              </Text>
              <Button
                title="Create Your First Listing"
                variant="outline"
                style={{ marginTop: APP_SPACING.lg }}
                onPress={() => router.push("/(owner)/add-turf")}
              />
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    listContent: {
      padding: APP_SPACING.lg,
      paddingTop: 0,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: APP_SPACING.xl,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: APP_FONT_SIZES.md,
      marginTop: APP_SPACING.md,
      textAlign: "center",
    },
  });
