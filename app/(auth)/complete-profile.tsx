import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { storage } from "@/firebase.config";
import { updateUserProfile } from "@/services/auth.service";
import { getNameError } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompleteProfileScreen() {
  const { user, firebaseUser, setUser } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"player" | "owner">("player");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!firebaseUser) return null;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${firebaseUser.uid}/profile.jpg`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.error("Image upload failed", e);
      return null;
    }
  };

  const handleCompleteProfile = async () => {
    const nameError = getNameError(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    if (!firebaseUser) return;

    setLoading(true);
    try {
      let profileUrl = null;
      if (image) {
        profileUrl = await uploadImage(image);
      }

      await updateUserProfile(firebaseUser.uid, {
        name,
        role,
        profilePicture: profileUrl || undefined,
      });

      if (user) {
        setUser({
          ...user,
          name,
          role,
          profilePicture: profileUrl || user.profilePicture,
        });
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
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
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
          </View>

          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons
                    name="camera-outline"
                    size={40}
                    color={APP_COLORS.textSecondary}
                  />
                </View>
              )}
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={14} color={APP_COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageLabel}>Add Photo</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError("");
              }}
              error={error}
              icon="person-outline"
              editable={!loading}
            />

            <Text style={styles.roleLabel}>I want to book as a:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "player" && styles.roleOptionActive,
                ]}
                onPress={() => setRole("player")}
                disabled={loading}
              >
                <Ionicons
                  name="football-outline"
                  size={24}
                  color={
                    role === "player"
                      ? APP_COLORS.white
                      : APP_COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.roleText,
                    role === "player" && styles.roleTextActive,
                  ]}
                >
                  Player
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "owner" && styles.roleOptionActive,
                ]}
                onPress={() => setRole("owner")}
                disabled={loading}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={
                    role === "owner"
                      ? APP_COLORS.white
                      : APP_COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.roleText,
                    role === "owner" && styles.roleTextActive,
                  ]}
                >
                  Owner
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title={loading ? "Saving..." : "Get Started"}
              onPress={handleCompleteProfile}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading || !name}
              style={styles.button}
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
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.xl,
    paddingBottom: APP_SPACING.xxl,
  },
  header: {
    marginBottom: APP_SPACING.xxl,
  },
  title: {
    fontSize: APP_FONT_SIZES.xxxl,
    fontWeight: "bold",
    color: APP_COLORS.text,
    marginBottom: APP_SPACING.sm,
  },
  subtitle: {
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.textSecondary,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: APP_SPACING.xl,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: APP_COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: APP_SPACING.sm,
    position: "relative",
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: APP_COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: APP_COLORS.background,
  },
  imageLabel: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    fontWeight: "500",
  },
  form: {
    flex: 1,
  },
  roleLabel: {
    fontSize: APP_FONT_SIZES.sm,
    fontWeight: "600",
    color: APP_COLORS.text,
    marginTop: APP_SPACING.md,
    marginBottom: APP_SPACING.sm,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: APP_SPACING.xl,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.md,
    paddingVertical: APP_SPACING.md,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginHorizontal: APP_SPACING.xs,
  },
  roleOptionActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  roleText: {
    fontSize: APP_FONT_SIZES.md,
    fontWeight: "600",
    color: APP_COLORS.textSecondary,
    marginLeft: APP_SPACING.sm,
  },
  roleTextActive: {
    color: APP_COLORS.white,
  },
  button: {
    marginTop: APP_SPACING.md,
  },
});
