import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
    APP_BORDER_RADIUS,
    APP_FONT_SIZES,
    APP_SHADOWS,
    APP_SPACING,
    getColors,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OwnerProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || "",
  );

  const handleEditAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = user?.profilePicture || "";

      if (profilePicture && profilePicture !== user?.profilePicture) {
        const uploadedUrl = await uploadToCloudinary(profilePicture);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          Alert.alert(
            "Warning",
            "Failed to upload image. Saving other changes.",
          );
        }
      }

      await updateProfile({
        name,
        phone,
        profilePicture: finalImageUrl,
      });

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name?.charAt(0) || "O"}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={handleEditAvatar}
          >
            <Ionicons name="camera" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
            <View style={styles.editActions}>
              <Button
                title="Cancel"
                variant="outline"
                size="small"
                onPress={() => {
                  setName(user?.name || "");
                  setPhone(user?.phone || "");
                  setProfilePicture(user?.profilePicture || "");
                  setIsEditing(false);
                }}
                style={{ flex: 1 }}
              />
              <Button
                title={loading ? "Saving..." : "Save"}
                size="small"
                onPress={handleSave}
                loading={loading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.name}>{user?.name || "Owner"}</Text>
            <Text style={styles.email}>
              {user?.email || "owner@example.com"}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Turf Owner</Text>
            </View>
            <Button
              title="Edit Profile"
              variant="outline"
              size="small"
              onPress={() => setIsEditing(true)}
              style={{ marginTop: APP_SPACING.md }}
            />
          </>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color={colors.primary} />
          <Text style={styles.menuText}>Business Settings</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.menuText}>Notification Preferences</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.menuText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
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
      alignItems: "center",
      padding: APP_SPACING.xl,
      backgroundColor: colors.card,
      borderBottomLeftRadius: APP_BORDER_RADIUS.xl,
      borderBottomRightRadius: APP_BORDER_RADIUS.xl,
      ...APP_SHADOWS.small,
    },
    avatarContainer: {
      marginBottom: APP_SPACING.lg,
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      ...APP_SHADOWS.medium,
    },
    avatarImage: {
      width: 110,
      height: 110,
      borderRadius: 55,
    },
    avatarText: {
      fontSize: APP_FONT_SIZES.xxxl,
      fontWeight: "bold",
      color: colors.white,
    },
    editAvatarButton: {
      position: "absolute",
      bottom: 4,
      right: 4,
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: colors.card,
      ...APP_SHADOWS.small,
    },
    name: {
      fontSize: APP_FONT_SIZES.xl,
      fontWeight: "bold",
      color: colors.text,
    },
    email: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },
    editForm: {
      width: "100%",
      marginTop: APP_SPACING.lg,
      gap: APP_SPACING.sm,
    },
    editActions: {
      flexDirection: "row",
      gap: APP_SPACING.md,
      marginTop: APP_SPACING.md,
    },
    badge: {
      backgroundColor: colors.primaryTransparent,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: APP_SPACING.md,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    badgeText: {
      color: colors.primary,
      fontWeight: "bold",
      fontSize: 12,
    },
    menu: {
      marginTop: APP_SPACING.xl,
      paddingHorizontal: APP_SPACING.lg,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: APP_SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuText: {
      flex: 1,
      marginLeft: APP_SPACING.md,
      fontSize: APP_FONT_SIZES.md,
      color: colors.text,
      fontWeight: "500",
    },
  });
