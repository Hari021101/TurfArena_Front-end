import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useTheme } from "@/context/ThemeContext";
import { formatTime, isSlotInPast, toDateString } from "@/utils/date";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface SlotGridProps {
  slots: string[]; // List of all possible time slots
  bookedSlots: string[]; // List of slots already booked
  selectedSlots: string[];
  onToggleSlot: (slot: string) => void;
  loading?: boolean;
  selectedDate: Date;
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
  selectedDate,
}: SlotGridProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  const renderItem = ({ item }: { item: string }) => {
    const isBooked = bookedSlots.includes(item);
    const isSelected = selectedSlots.includes(item);
    const isPast = isSlotInPast(toDateString(selectedDate), item);

    let backgroundColor = colors.card;
    let borderColor = colors.border;
    let textColor = colors.white;
    let opacity = 1;

    if (isBooked || isPast) {
      backgroundColor = colors.card; // Keep same background for past
      borderColor = colors.border;
      opacity = 0.4;
      textColor = colors.textTertiary;
    } else if (isSelected) {
      backgroundColor = colors.primary;
      borderColor = colors.primary;
      textColor = colors.white;
    }

    const formatRange = (range: string) => {
      const [start, end] = range.split(" - ");
      return `${formatTime(start)} - ${formatTime(end)}`;
    };

    return (
      <TouchableOpacity
        style={[styles.slotItem, { backgroundColor, borderColor, opacity }]}
        onPress={() => onToggleSlot(item)}
        disabled={isBooked || isPast || loading}
      >
        <Text style={[styles.slotText, { color: textColor }]}>
          {formatRange(item)}
        </Text>
        {isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
        {isPast && !isBooked && <Text style={styles.pastLabel}>Passed</Text>}
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

const createStyles = (colors: any) =>
  StyleSheet.create({
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
      color: colors.error,
      fontWeight: "bold",
      textTransform: "uppercase",
      marginTop: 2,
    },
    pastLabel: {
      fontSize: 8,
      color: colors.textTertiary,
      fontWeight: "bold",
      textTransform: "uppercase",
      marginTop: 2,
    },
  });
