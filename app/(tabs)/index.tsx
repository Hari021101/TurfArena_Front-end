import Input from "@/components/ui/Input";
import TurfCard from "@/components/ui/TurfCard";
import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
    getSelectedLocation,
    Region,
    State,
} from "@/services/location.service";
import { getAllTurfs } from "@/services/turf.service";
import { Turf } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "Cricket", name: "Cricket", icon: "baseball-outline" },
  { id: "Football", name: "Football", icon: "football-outline" },
  { id: "Badminton", name: "Badminton", icon: "fitness-outline" },
];

export default function HomeScreen() {
  const { user, isFirestoreBlocked } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<{
    region: Region;
    state: State;
  } | null>(null);

  const fetchTurfs = async () => {
    try {
      const data = await getAllTurfs();
      setTurfs(data);
    } catch (error: any) {
      console.error("Error fetching turfs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadLocation = async () => {
    const loc = await getSelectedLocation();
    setSelectedLocation(loc);
  };

  useEffect(() => {
    fetchTurfs();
    loadLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLocation();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTurfs();
  };

  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearch = turf.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLocation = selectedLocation
      ? turf.regionId === selectedLocation.region.id
      : true;
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : turf.sportTypes?.includes(selectedCategory);
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const featuredTurfs = turfs
    .filter((t) => t.rating && t.rating >= 4.7)
    .slice(0, 5);

  const styles = createStyles(colors);

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.welcomeText}>
              Hello, {user?.name || "Player"}! 👋
            </Text>
            <TouchableOpacity
              style={styles.locationPicker}
              onPress={() => router.push("/state-select")}
            >
              <Ionicons
                name="location-sharp"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.locationText}>
                {selectedLocation
                  ? `${selectedLocation.region.name}, ${selectedLocation.state.name}`
                  : "Select Location"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
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
          placeholder="Search arenas, sports, locations..."
          value={search}
          onChangeText={setSearch}
          icon="search"
          containerStyle={styles.searchBar}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={18}
                color={
                  selectedCategory === cat.id ? colors.white : colors.primary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Section */}
      {!search && selectedCategory === "all" && featuredTurfs.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Arenas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContent}
          >
            {featuredTurfs.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() =>
                  router.push({
                    pathname: "/turf-details",
                    params: { id: item.id },
                  })
                }
              >
                <Image
                  source={{ uri: item.photos[0] }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={10} color={colors.white} />
                  <Text style={styles.featuredBadgeText}>{item.rating}</Text>
                </View>
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.featuredPrice}>
                    ₹{item.pricePerHour}/hr
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {search
            ? "Search Results"
            : selectedCategory !== "all"
              ? `${selectedCategory} Arenas`
              : "Discover Arenas"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name={
                  isFirestoreBlocked ? "shield-outline" : "football-outline"
                }
                size={60}
                color={isFirestoreBlocked ? colors.error : colors.textTertiary}
              />
              <Text
                style={isFirestoreBlocked ? styles.errorText : styles.emptyText}
              >
                {isFirestoreBlocked
                  ? "Database Blocked by Browser"
                  : "No arenas found matching your criteria"}
              </Text>
              {isFirestoreBlocked && (
                <Text style={styles.errorSubtext}>
                  Please disable your Ad-Blocker for localhost to see the turfs.
                </Text>
              )}
            </View>
          ) : null
        }
      />
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
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: colors.primary,
    },
    avatarPlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      color: colors.white,
      fontWeight: "bold",
      fontSize: APP_FONT_SIZES.md,
    },
    welcomeText: {
      fontSize: APP_FONT_SIZES.xxl,
      fontWeight: "bold",
      color: colors.text,
    },
    locationPicker: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      gap: 4,
    },
    locationText: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.primary,
      fontWeight: "600",
    },
    searchBar: {
      marginBottom: APP_SPACING.md,
    },
    categoriesSection: {
      marginBottom: APP_SPACING.lg,
    },
    categoriesContent: {
      paddingHorizontal: APP_SPACING.lg,
      gap: APP_SPACING.sm,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: APP_SPACING.md,
      paddingVertical: APP_SPACING.sm,
      borderRadius: APP_BORDER_RADIUS.round,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: APP_FONT_SIZES.sm,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    categoryTextActive: {
      color: colors.white,
    },
    section: {
      marginBottom: APP_SPACING.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: APP_SPACING.lg,
      marginBottom: APP_SPACING.md,
    },
    sectionTitle: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.text,
    },
    seeAllText: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.primary,
      fontWeight: "600",
    },
    featuredContent: {
      paddingHorizontal: APP_SPACING.lg,
      gap: APP_SPACING.md,
    },
    featuredCard: {
      width: 200,
      height: 250,
      borderRadius: APP_BORDER_RADIUS.lg,
      overflow: "hidden",
      position: "relative",
    },
    featuredImage: {
      width: "100%",
      height: "100%",
    },
    featuredOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: APP_SPACING.md,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    featuredName: {
      color: colors.white,
      fontSize: APP_FONT_SIZES.md,
      fontWeight: "bold",
    },
    featuredPrice: {
      color: colors.primary,
      fontSize: APP_FONT_SIZES.sm,
      fontWeight: "bold",
      marginTop: 2,
    },
    featuredBadge: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: colors.accent,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    featuredBadgeText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: "bold",
    },
    listContent: {
      paddingBottom: APP_SPACING.xxxl,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 60,
      paddingHorizontal: APP_SPACING.xxl,
    },
    emptyText: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.textSecondary,
      marginTop: APP_SPACING.md,
      textAlign: "center",
    },
    errorText: {
      fontSize: APP_FONT_SIZES.lg,
      fontWeight: "bold",
      color: colors.error,
      marginTop: APP_SPACING.md,
      textAlign: "center",
    },
    errorSubtext: {
      fontSize: APP_FONT_SIZES.md,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
  });
