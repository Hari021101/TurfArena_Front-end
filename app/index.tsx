import { APP_COLORS } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const { loading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in, go to login
        router.replace("/(auth)/login");
      } else if (!user || !user.name) {
        // Logged in but profile incomplete
        router.replace("/(auth)/complete-profile");
      } else {
        // Logged in and profile complete
        router.replace("/(tabs)");
      }
    }
  }, [loading, isAuthenticated, user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
