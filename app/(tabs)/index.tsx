import Input from "@/components/ui/Input";
import TurfCard from "@/components/ui/TurfCard";
import { APP_COLORS, APP_FONT_SIZES, APP_SPACING } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { getAllTurfs } from "@/services/turf.service";
import { Turf } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTurfs = async () => {
    try {
      const data = await getAllTurfs();
      setTurfs(data);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTurfs();
  };

  const filteredTurfs = turfs.filter(
    (turf) =>
      turf.name.toLowerCase().includes(search.toLowerCase()) ||
      turf.location.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.welcomeText}>
              Hello, {user?.name || "Player"}! 👋
            </Text>
            <Text style={styles.tagline}>Book your slot at our arenas</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Search our turfs..."
          value={search}
          onChangeText={setSearch}
          icon="search"
          containerStyle={styles.searchBar}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Arenas</Text>
      </View>

      <FlatList
        data={filteredTurfs}
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
                name="football-outline"
                size={60}
                color={APP_COLORS.textTertiary}
              />
              <Text style={styles.emptyText}>No arenas found</Text>
            </View>
          ) : null
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
    paddingTop: APP_SPACING.md,
    paddingBottom: APP_SPACING.sm,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: APP_SPACING.md,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: APP_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: APP_COLORS.white,
    fontWeight: "bold",
    fontSize: APP_FONT_SIZES.md,
  },
  welcomeText: {
    fontSize: APP_FONT_SIZES.xxl,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  tagline: {
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.textSecondary,
    marginTop: 4,
  },
  searchBar: {
    marginBottom: 0,
  },
  sectionHeader: {
    paddingHorizontal: APP_SPACING.lg,
    marginTop: APP_SPACING.sm,
    marginBottom: APP_SPACING.xs,
  },
  sectionTitle: {
    fontSize: APP_FONT_SIZES.lg,
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
    marginTop: 60,
  },
  emptyText: {
    fontSize: APP_FONT_SIZES.lg,
    fontWeight: "bold",
    color: APP_COLORS.textSecondary,
    marginTop: APP_SPACING.md,
  },
});
