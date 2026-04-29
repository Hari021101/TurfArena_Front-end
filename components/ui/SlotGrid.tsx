import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import React from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

interface SlotGridProps {
  slots: string[]; // List of all possible time slots
  bookedSlots: string[]; // List of slots already booked
  selectedSlots: string[];
  onToggleSlot: (slot: string) => void;
  loading?: boolean;
}

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const ITEM_WIDTH =
  (width - APP_SPACING.lg * 2 - APP_SPACING.sm * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

export default function SlotGrid({
  slots,
  bookedSlots,
  selectedSlots,
  onToggleSlot,
  loading = false,
}: SlotGridProps) {
  const renderItem = ({ item }: { item: string }) => {
    const isBooked = bookedSlots.includes(item);
    const isSelected = selectedSlots.includes(item);

    let backgroundColor = APP_COLORS.card;
    let borderColor = APP_COLORS.border;
    let textColor = APP_COLORS.white;

    if (isBooked) {
      backgroundColor = APP_COLORS.slotBooked + "20"; // Semi-transparent red
      borderColor = APP_COLORS.error;
      textColor = APP_COLORS.textTertiary;
    } else if (isSelected) {
      backgroundColor = APP_COLORS.primary;
      borderColor = APP_COLORS.primary;
      textColor = APP_COLORS.white;
    }

    return (
      <TouchableOpacity
        style={[styles.slotItem, { backgroundColor, borderColor }]}
        onPress={() => onToggleSlot(item)}
        disabled={isBooked || loading}
      >
        <Text style={[styles.slotText, { color: textColor }]}>{item}</Text>
        {isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={slots}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: APP_SPACING.md,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.sm,
  },
  slotItem: {
    width: ITEM_WIDTH,
    height: 60,
    borderRadius: APP_BORDER_RADIUS.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  slotText: {
    fontSize: APP_FONT_SIZES.sm,
    fontWeight: "700",
    textAlign: "center",
  },
  bookedLabel: {
    fontSize: 8,
    color: APP_COLORS.error,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 2,
  },
});
