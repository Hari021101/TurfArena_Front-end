import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { STATES, State } from "@/services/location.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLUMN_COUNT = 2;

export default function StateSelectScreen() {
  const [search, setSearch] = useState("");

  const filteredStates = STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleStateSelect = (state: State) => {
    router.push({
      pathname: "/region-select",
      params: { stateId: state.id },
    });
  };

  const renderStateItem = ({ item }: { item: State }) => (
    <TouchableOpacity
      style={styles.stateCard}
      onPress={() => handleStateSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.logo }} style={styles.stateImage} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.stateName} numberOfLines={1}>
          {item.name}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={APP_COLORS.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={APP_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select State</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={APP_COLORS.textSecondary} />
          <TextInput
            placeholder="Search state..."
            placeholderTextColor={APP_COLORS.textSecondary}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredStates}
        renderItem={renderStateItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No states found</Text>
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
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: APP_SPACING.md,
  },
  stateCard: {
    width: "48%",
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  stateImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: APP_SPACING.md,
  },
  stateName: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.text,
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
