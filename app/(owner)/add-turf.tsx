import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { APP_COLORS, APP_FONT_SIZES, APP_SPACING } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { createTurf } from "@/services/turf.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SPORT_OPTIONS = [
  "Cricket",
  "Football",
  "Badminton",
  "Tennis",
  "Basketball",
];

export default function AddTurfScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    pricePerHour: "",
    description: "",
    startTime: "06:00",
    endTime: "23:00",
    sportTypes: [] as string[],
  });

  const toggleSport = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      sportTypes: prev.sportTypes.includes(sport)
        ? prev.sportTypes.filter((s) => s !== sport)
        : [...prev.sportTypes, sport],
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.city || !formData.pricePerHour) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await createTurf({
        name: formData.name,
        ownerId: user.id,
        location: {
          address: formData.address,
          city: formData.city,
          latitude: 0, // Placeholder
          longitude: 0, // Placeholder
        },
        pricePerHour: parseInt(formData.pricePerHour),
        description: formData.description,
        timing: {
          start: formData.startTime,
          end: formData.endTime,
        },
        sportTypes: formData.sportTypes,
        photos: [
          "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000",
        ], // Default photo
        amenities: ["Parking", "Water"],
        isActive: true,
      });

      Alert.alert("Success", "Your turf has been listed successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create turf listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={APP_COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.title}>List Your Arena</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionLabel}>General Info</Text>
            <Input
              label="Arena Name *"
              placeholder="e.g. Champion Arena"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              icon="business-outline"
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: APP_SPACING.md }}>
                <Input
                  label="City *"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData({ ...formData, city: text })
                  }
                  icon="location-outline"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Price / Hour (₹) *"
                  placeholder="e.g. 1200"
                  keyboardType="numeric"
                  value={formData.pricePerHour}
                  onChangeText={(text) =>
                    setFormData({ ...formData, pricePerHour: text })
                  }
                  icon="cash-outline"
                />
              </View>
            </View>

            <Input
              label="Address"
              placeholder="Detailed address"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              icon="map-outline"
              multiline
            />

            <Input
              label="Description"
              placeholder="Tell players about your turf..."
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              icon="document-text-outline"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.sectionLabel}>Available Sports</Text>
            <View style={styles.sportsContainer}>
              {SPORT_OPTIONS.map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.sportChip,
                    formData.sportTypes.includes(sport) &&
                      styles.sportChipActive,
                  ]}
                  onPress={() => toggleSport(sport)}
                >
                  <Text
                    style={[
                      styles.sportChipText,
                      formData.sportTypes.includes(sport) &&
                        styles.sportChipTextActive,
                    ]}
                  >
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title={loading ? "Saving..." : "Create Listing"}
              onPress={handleSave}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: APP_SPACING.lg,
  },
  backButton: {
    marginRight: APP_SPACING.md,
  },
  title: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    color: APP_COLORS.white,
  },
  form: {
    paddingHorizontal: APP_SPACING.lg,
  },
  sectionLabel: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "bold",
    color: APP_COLORS.primary,
    marginTop: APP_SPACING.lg,
    marginBottom: APP_SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.xl,
  },
  sportChip: {
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderRadius: 20,
    backgroundColor: APP_COLORS.card,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  sportChipActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  sportChipText: {
    color: APP_COLORS.textSecondary,
    fontWeight: "600",
  },
  sportChipTextActive: {
    color: APP_COLORS.white,
  },
  saveButton: {
    marginTop: APP_SPACING.xl,
  },
});
