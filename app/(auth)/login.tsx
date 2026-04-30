import { APP_COLORS } from "@/constants/appTheme";
import { useAuth } from "@/context/AuthContext";
import {
    createUserProfile,
    getUserProfile,
    signInWithGoogle,
} from "@/services/auth.service";
import { seedDummyTurfs } from "@/services/turf.service";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { bypassLogin, isFirestoreBlocked } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"player" | "owner">(
    "player",
  );

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId:
      "158260737782-2ka1uoiaglf7a4aqja07t9s4869oo6l1.apps.googleusercontent.com",
    androidClientId:
      "158260737782-2ka1uoiaglf7a4aqja07t9s4869oo6l1.apps.googleusercontent.com",
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
      const userProfile = await getUserProfile(firebaseUser.uid);

      if (!userProfile) {
        await createUserProfile(firebaseUser.uid, {
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          profilePicture: firebaseUser.photoURL || undefined,
          role: selectedRole,
        });

        if (selectedRole === "owner") {
          router.replace("/(owner)");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        if (userProfile.role === "owner") {
          router.replace("/(owner)");
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      const errorMsg = error?.message?.toLowerCase() || "";
      if (errorMsg.includes("offline") || errorMsg.includes("client")) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Error",
          "Failed to sign in with Google. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      await seedDummyTurfs();
      if (bypassLogin) await bypassLogin(selectedRole);

      if (selectedRole === "owner") {
        router.replace("/(owner)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (e) {
      Alert.alert("Error", "Developer login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1556627045-814d45fa97f6?q=80&w=1000",
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["rgba(15, 23, 42, 0.4)", "rgba(15, 23, 42, 0.95)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <Animated.View
                entering={FadeInUp.duration(1000).springify()}
                style={styles.header}
              >
                <View style={styles.logoContainer}>
                  <Ionicons
                    name="football"
                    size={60}
                    color={APP_COLORS.primary}
                  />
                </View>
                <Text style={styles.appName}>TURF ARENA</Text>
                <Text style={styles.tagline}>Elevate Your Game</Text>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(400).duration(1000).springify()}
                style={styles.cardContainer}
              >
                <View style={styles.glassCard}>
                  <Text style={styles.cardTitle}>Welcome Back</Text>
                  <Text style={styles.cardSubtitle}>
                    Book premium pits and cages instantly. Join the community.
                  </Text>

                  <View style={styles.roleSelector}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "player" && styles.roleButtonActive,
                      ]}
                      onPress={() => setSelectedRole("player")}
                    >
                      <Ionicons
                        name="person"
                        size={18}
                        color={
                          selectedRole === "player"
                            ? APP_COLORS.white
                            : APP_COLORS.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.roleButtonText,
                          selectedRole === "player" &&
                            styles.roleButtonTextActive,
                        ]}
                      >
                        PLAYER
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "owner" && styles.roleButtonActive,
                      ]}
                      onPress={() => setSelectedRole("owner")}
                    >
                      <Ionicons
                        name="business"
                        size={18}
                        color={
                          selectedRole === "owner"
                            ? APP_COLORS.white
                            : APP_COLORS.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.roleButtonText,
                          selectedRole === "owner" &&
                            styles.roleButtonTextActive,
                        ]}
                      >
                        ADMIN
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isFirestoreBlocked ? (
                    <View style={styles.blockedAlert}>
                      <Ionicons
                        name="alert-circle"
                        size={24}
                        color={APP_COLORS.error}
                      />
                      <Text style={styles.blockedText}>
                        Database connection restricted.
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          typeof window !== "undefined" &&
                          window.location.reload()
                        }
                        style={styles.retryLink}
                      >
                        <Text style={styles.retryText}>Fix & Refresh</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => promptAsync()}
                        disabled={loading || !request}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[APP_COLORS.primary, "#059669"]}
                          style={styles.premiumButton}
                        >
                          <Ionicons name="logo-google" size={22} color="#fff" />
                          <Text style={styles.premiumButtonText}>
                            {loading
                              ? "Authenticating..."
                              : "CONTINUE WITH GOOGLE"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <Text style={styles.privacyNote}>
                        Zero spam. Secure authentication.
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleDevLogin}
                  style={styles.devBypass}
                >
                  <Text style={styles.devBypassText}>
                    DEBUG: SKIP AUTHENTICATION
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(800).duration(1000)}
                style={styles.footer}
              >
                <Text style={styles.footerLink}>TERMS</Text>
                <View style={styles.dot} />
                <Text style={styles.footerLink}>PRIVACY</Text>
                <View style={styles.dot} />
                <Text style={styles.footerLink}>SUPPORT</Text>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 16,
    color: APP_COLORS.primary,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 4,
    textTransform: "uppercase",
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
  glassCard: {
    width: "100%",
    padding: 32,
    borderRadius: 32,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#94A3B8",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 18,
    gap: 12,
  },
  premiumButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  privacyNote: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 16,
  },
  roleSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: APP_COLORS.primary,
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: APP_COLORS.textSecondary,
    letterSpacing: 1,
  },
  roleButtonTextActive: {
    color: APP_COLORS.white,
  },
  blockedAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  blockedText: {
    color: APP_COLORS.error,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  retryLink: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: APP_COLORS.error,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  devBypass: {
    marginTop: 24,
    padding: 12,
  },
  devBypassText: {
    color: "rgba(148, 163, 184, 0.5)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  footerLink: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#334155",
  },
});
