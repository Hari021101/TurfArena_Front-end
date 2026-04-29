import Button from "@/components/ui/Button";
import {
  APP_BORDER_RADIUS,
  APP_COLORS,
  APP_FONT_SIZES,
  APP_SPACING,
} from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import {
  createUserProfile,
  getUserProfile,
  signInWithGoogle,
} from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { bypassLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  // Update these IDs with your actual ones from Google Cloud Console
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: "158260737782-yourwebclientid.apps.googleusercontent.com",
    iosClientId: "158260737782-yourioscientid.apps.googleusercontent.com",
    androidClientId:
      "158260737782-yourandroidclientid.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const firebaseUser = await signInWithGoogle(idToken);

      // Check if user profile already exists
      const userProfile = await getUserProfile(firebaseUser.uid);

      if (!userProfile) {
        // New user! Redirect to profile completion
        // We create a skeleton profile first so we can refer to it
        await createUserProfile(firebaseUser.uid, {
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          profilePicture: firebaseUser.photoURL || undefined,
        });
        router.replace("/(auth)/complete-profile");
      } else {
        // Existing user, go to home
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      if (bypassLogin) {
        await bypassLogin();
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Developer mode not available");
      }
    } catch (e) {
      console.error("Dev login failed", e);
      Alert.alert("Error", "Developer login failed");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1556627045-814d45fa97f6?q=80&w=1000",
      }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to</Text>
              <Text style={styles.appName}>🏏 Turf Arena</Text>
              <Text style={styles.subtitle}>
                Book your favorite turf in seconds
              </Text>
            </View>

            <View style={styles.form}>
              <Button
                title={loading ? "Signing in..." : "Sign in with Google"}
                onPress={() => promptAsync()}
                variant="outline"
                size="large"
                fullWidth
                loading={loading}
                disabled={loading || !request}
                icon={
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color={APP_COLORS.primary}
                  />
                }
                style={styles.googleButton}
                textStyle={styles.googleButtonText}
              />

              <Text style={styles.hint}>
                Sign in securely with your Google account
              </Text>

              <TouchableOpacity
                onPress={handleDevLogin}
                style={styles.devButton}
                activeOpacity={0.7}
              >
                <Text style={styles.devButtonText}>
                  Developer Bypass (Skip Login)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: APP_SPACING.lg,
    justifyContent: "space-between",
  },
  header: {
    marginTop: APP_SPACING.xxxl,
    alignItems: "center",
  },
  title: {
    fontSize: APP_FONT_SIZES.xl,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.xs,
  },
  appName: {
    fontSize: APP_FONT_SIZES.huge,
    fontWeight: "bold",
    color: APP_COLORS.primary,
    marginBottom: APP_SPACING.md,
  },
  subtitle: {
    fontSize: APP_FONT_SIZES.md,
    color: APP_COLORS.textSecondary,
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    marginBottom: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderColor: APP_COLORS.border,
  },
  googleButtonText: {
    color: APP_COLORS.background,
  },
  hint: {
    fontSize: APP_FONT_SIZES.sm,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.xxl,
    textAlign: "center",
  },
  devButton: {
    marginTop: APP_SPACING.xl,
    alignItems: "center",
    padding: APP_SPACING.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
    borderRadius: APP_BORDER_RADIUS.md,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: APP_SPACING.xl,
  },
  devButtonText: {
    color: APP_COLORS.primary,
    fontWeight: "bold",
    fontSize: APP_FONT_SIZES.md,
  },
  footer: {
    paddingVertical: APP_SPACING.lg,
  },
  footerText: {
    fontSize: APP_FONT_SIZES.xs,
    color: APP_COLORS.textTertiary,
    textAlign: "center",
    lineHeight: 18,
  },
});
