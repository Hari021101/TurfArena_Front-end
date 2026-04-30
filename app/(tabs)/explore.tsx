import TurfCard from "@/components/ui/TurfCard";
import { APP_COLORS, APP_FONT_SIZES, APP_SPACING } from "@/constants/appTheme";
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
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "cricket", name: "Cricket", icon: "baseball-outline" },
  { id: "football", name: "Football", icon: "football-outline" },
  { id: "badminton", name: "Badminton", icon: "fitness-outline" },
  { id: "tennis", name: "Tennis", icon: "tennisball-outline" },
];

export default function ExploreScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState<{
    region: Region;
    state: State;
  } | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocation = async () => {
    const loc = await getSelectedLocation();
    setSelectedLocation(loc);
  };

  useEffect(() => {
    loadLocation();
    fetchTurfs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLocation();
    }, []),
  );

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      const data = await getAllTurfs();
      setTurfs(data);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearch = turf.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      turf.sportTypes?.some((s) => s.includes(category)) ||
      (category === "Other" &&
        !turf.sportTypes?.some((s) => ["Football", "Cricket"].includes(s)));
    const matchesLocation = selectedLocation
      ? turf.regionId === selectedLocation.region.id
      : true;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Grounds</Text>
        <TouchableOpacity
          style={styles.locationPicker}
          onPress={() => router.push("/state-select")}
        >
          <Ionicons
            name="location-sharp"
            size={14}
            color={APP_COLORS.primary}
          />
          <Text style={styles.locationText}>
            {selectedLocation
              ? `${selectedLocation.region.name}, ${selectedLocation.state.name}`
              : "Select Location"}
          </Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={APP_COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search our turfs..."
            placeholderTextColor={APP_COLORS.textTertiary}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={APP_COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                category === item.name && styles.selectedCategoryItem,
              ]}
              onPress={() => setCategory(item.name)}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={
                  category === item.name
                    ? APP_COLORS.white
                    : APP_COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  category === item.name && styles.selectedCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={APP_COLORS.primary} />
        </View>
      ) : (
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
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="search-outline"
                size={60}
                color={APP_COLORS.textTertiary}
              />
              <Text style={styles.emptyText}>
                No turfs found matching your criteria
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  header: {
    padding: APP_SPACING.lg,
  },
  title: {
    fontSize: APP_FONT_SIZES.xxl,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  locationPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: APP_COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginTop: 4,
    alignSelf: "flex-start",
    marginBottom: APP_SPACING.md,
  },
  locationText: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: APP_COLORS.card,
    borderRadius: 12,
    paddingHorizontal: APP_SPACING.md,
    height: 50,
  },
  searchIcon: {
    marginRight: APP_SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: APP_COLORS.white,
    fontSize: APP_FONT_SIZES.md,
  },
  categoriesContainer: {
    marginBottom: APP_SPACING.md,
  },
  categoriesList: {
    paddingHorizontal: APP_SPACING.lg,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderRadius: 20,
    backgroundColor: APP_COLORS.card,
    marginRight: APP_SPACING.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  selectedCategoryItem: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  categoryText: {
    color: APP_COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: APP_COLORS.white,
  },
  listContent: {
    padding: APP_SPACING.lg,
    paddingTop: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    color: APP_COLORS.textSecondary,
    fontSize: APP_FONT_SIZES.md,
    marginTop: APP_SPACING.md,
    textAlign: "center",
  },
});
