import { APP_COLORS } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const { loading, isAuthenticated, user } = useAuth();
  const [debugTimer, setDebugTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDebugTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/(auth)/login");
      } else {
        if (user?.role === "owner") {
          router.replace("/(owner)");
        } else {
          router.replace("/(tabs)");
        }
      }
    }
  }, [loading, isAuthenticated, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={APP_COLORS.primary} />
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Loading: {loading ? "Yes" : "No"}</Text>
        <Text style={styles.debugText}>
          Authenticated: {isAuthenticated ? "Yes" : "No"}
        </Text>
        <Text style={styles.debugText}>Timer: {debugTimer}s</Text>
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
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
  },
  debugText: {
    color: "#666",
    fontSize: 12,
    marginVertical: 2,
  },
});
