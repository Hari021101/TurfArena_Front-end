import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
    APP_BORDER_RADIUS,
    APP_COLORS,
    APP_FONT_SIZES,
    APP_SPACING,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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
  const { user, logout } = useAuth();

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

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", onPress: () => {} },
    {
      icon: "calendar-outline",
      label: "My Bookings",
      onPress: () => router.push("/(tabs)/bookings"),
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
            <Ionicons
              name="log-out-outline"
              size={24}
              color={APP_COLORS.error}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={APP_COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || "Player"}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={APP_COLORS.primary}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={APP_COLORS.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Card variant="outlined" style={styles.beOwnerCard}>
          <View style={styles.beOwnerHeader}>
            <View>
              <Text style={styles.beOwnerTitle}>Are you a Turf Owner?</Text>
              <Text style={styles.beOwnerSubtitle}>
                Start listing your arena today
              </Text>
            </View>
            <Ionicons name="business" size={32} color={APP_COLORS.primary} />
          </View>
          <Button
            title="Register as Owner"
            variant="outline"
            size="small"
            onPress={() => {}}
            style={styles.beOwnerButton}
          />
        </Card>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
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
    color: APP_COLORS.white,
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
    borderColor: APP_COLORS.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: APP_COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: APP_COLORS.primary,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: APP_COLORS.primary,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: APP_COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: APP_COLORS.background,
  },
  userName: {
    fontSize: APP_FONT_SIZES.xl,
    fontWeight: "bold",
    color: APP_COLORS.white,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.sm,
  },
  roleBadge: {
    backgroundColor: APP_COLORS.primaryTransparent,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 4,
    borderRadius: APP_BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
  },
  roleText: {
    color: APP_COLORS.primary,
    fontSize: APP_FONT_SIZES.xs,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  menuContainer: {
    backgroundColor: APP_COLORS.card,
    borderRadius: APP_BORDER_RADIUS.lg,
    padding: APP_SPACING.sm,
    marginBottom: APP_SPACING.xl,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: APP_SPACING.md,
    paddingHorizontal: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: APP_SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.text,
    fontWeight: "500",
  },
  beOwnerCard: {
    backgroundColor: APP_COLORS.primaryTransparent,
    borderColor: APP_COLORS.primary,
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
    color: APP_COLORS.white,
    marginBottom: 4,
  },
  beOwnerSubtitle: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
  },
  beOwnerButton: {
    alignSelf: "flex-start",
  },
  versionText: {
    textAlign: "center",
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textTertiary,
    marginTop: APP_SPACING.xl,
  },
});
