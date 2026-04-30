import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import {
    REGIONS,
    STATES,
    saveSelectedLocation,
} from "@/services/location.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegionSelectScreen() {
  const { stateId } = useLocalSearchParams<{ stateId: string }>();
  const [search, setSearch] = useState("");

  const state = STATES.find((s) => s.id === stateId);
  const regions = REGIONS[stateId as string] || [];

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRegionSelect = async (region: any) => {
    if (state) {
      await saveSelectedLocation(region, state);
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={APP_COLORS.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Select District</Text>
          <Text style={styles.subtitle}>{state?.name}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={APP_COLORS.textSecondary} />
          <TextInput
            placeholder="Search district or city..."
            placeholderTextColor={APP_COLORS.textSecondary}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredRegions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.regionItem}
            onPress={() => handleRegionSelect(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="location-sharp"
              size={20}
              color={APP_COLORS.primary}
            />
            <Text style={styles.regionName}>{item.name}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={APP_COLORS.border}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No districts found in this state
            </Text>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.md,
  },
  backButton: {
    padding: 8,
    marginRight: APP_SPACING.md,
  },
  title: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    color: APP_COLORS.text,
  },
  subtitle: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.primary,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: APP_SPACING.lg,
    paddingBottom: APP_SPACING.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.md,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: APP_SPACING.sm,
    color: APP_COLORS.text,
    fontSize: APP_FONT_SIZES.md,
  },
  listContent: {
    paddingHorizontal: APP_SPACING.lg,
  },
  regionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: APP_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  regionName: {
    flex: 1,
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.text,
    marginLeft: APP_SPACING.md,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    color: APP_COLORS.textSecondary,
    fontSize: APP_FONT_SIZES.md,
  },
});
