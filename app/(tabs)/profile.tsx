import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
  APP_BORDER_RADIUS,
  APP_FONT_SIZES,
  APP_SPACING,
  getColors,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, setMode, isDark } = useTheme();
  const colors = getColors(isDark);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || "",
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const toggleTheme = () => {
    setMode(theme === "dark" ? "light" : "dark");
  };

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

      // If profilePicture has changed and it's a local URI, upload it
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

  const menuItems = [
    {
      icon: "person-outline",
      label: isEditing ? "Cancel Editing" : "Edit Profile",
      onPress: () => {
        if (isEditing) {
          setName(user?.name || "");
          setPhone(user?.phone || "");
          setProfilePicture(user?.profilePicture || "");
        }
        setIsEditing(!isEditing);
      },
    },
    {
      icon: "calendar-outline",
      label: "My Bookings",
      onPress: () => router.push("/(tabs)/bookings"),
    },
    {
      icon: theme === "dark" ? "moon" : "sunny",
      label: "App Theme",
      onPress: toggleTheme,
      rightElement: (
        <View
          style={[
            styles.themeBadge,
            { backgroundColor: colors.primaryTransparent },
          ]}
        >
          <Text style={[styles.themeBadgeText, { color: colors.primary }]}>
            {theme.toUpperCase()}
          </Text>
        </View>
      ),
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      onPress: () => {},
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy Policy",
      onPress: () => {},
    },
    { icon: "help-circle-outline", label: "Help & Support", onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{name?.charAt(0) || "U"}</Text>
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
              <Button
                title={loading ? "Saving..." : "Save Changes"}
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
              <Text style={styles.userPhone}>{user?.phone}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role || "Player"}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.rightElement ? (
                item.rightElement
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textTertiary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {!isEditing && (
          <Card variant="outlined" style={styles.beOwnerCard}>
            <View style={styles.beOwnerHeader}>
              <View>
                <Text style={styles.beOwnerTitle}>Are you a Turf Owner?</Text>
                <Text style={styles.beOwnerSubtitle}>
                  Start listing your arena today
                </Text>
              </View>
              <Ionicons name="business" size={32} color={colors.primary} />
            </View>
            <Button
              title="Register as Owner"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.beOwnerButton}
            />
          </Card>
        )}

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: APP_SPACING.lg,
      paddingBottom: APP_SPACING.xxxl,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: APP_SPACING.md,
      marginBottom: APP_SPACING.md,
    },
    headerTitle: {
      fontSize: APP_FONT_SIZES.xl,
      fontWeight: "bold",
      color: colors.text,
    },
    profileInfo: {
      alignItems: "center",
      marginBottom: APP_SPACING.xxl,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: APP_SPACING.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarText: {
      fontSize: 40,
      fontWeight: "bold",
      color: colors.primary,
    },
    editAvatarButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },
    userName: {
      fontSize: APP_FONT_SIZES.xl,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    userPhone: {
      fontSize: APP_FONT_SIZES.sm,
      color: colors.textSecondary,
      marginBottom: APP_SPACING.sm,
    },
    roleBadge: {
      backgroundColor: colors.primaryTransparent,
      paddingHorizontal: APP_SPACING.md,
      paddingVertical: 4,
      borderRadius: APP_BORDER_RADIUS.round,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    roleText: {
      color: colors.primary,
      fontSize: APP_FONT_SIZES.xs,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    editForm: {
      width: "100%",
      marginTop: APP_SPACING.md,
      gap: APP_SPACING.sm,
    },
    saveButton: {
      marginTop: APP_SPACING.md,
    },
    menuContainer: {
      backgroundColor: colors.card,
      borderRadius: APP_BORDER_RADIUS.lg,
      padding: APP_SPACING.sm,
      marginBottom: APP_SPACING.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: APP_SPACING.md,
      paddingHorizontal: APP_SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: APP_SPACING.md,
    },
    menuLabel: {
      flex: 1,
      fontSize: APP_FONT_SIZES.md,
      color: colors.text,
      fontWeight: "500",
    },
    themeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    themeBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
    },
    beOwnerCard: {
      backgroundColor: colors.primaryTransparent,
      borderColor: colors.primary,
    },
    beOwnerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: APP_SPACING.md,
    },
    beOwnerTitle: {
      fontSize: APP_FONT_SIZES.md,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    beOwnerSubtitle: {
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textSecondary,
    },
    beOwnerButton: {
      alignSelf: "flex-start",
    },
    versionText: {
      textAlign: "center",
      fontSize: APP_FONT_SIZES.xs,
      color: colors.textTertiary,
      marginTop: APP_SPACING.xl,
    },
  });
