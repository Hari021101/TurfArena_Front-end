// Authentication Context for global state management
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  logout as authLogout,
  getUserProfile,
  updateUserProfile,
  isAuthenticated as checkAuthStatus,
} from "@/services/auth.service";
import {
  addNotificationListeners,
  registerForPushNotificationsAsync,
} from "@/services/notification.service";
import { User } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const FAVOURITES_KEY = "favourite_turfs";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isFirestoreBlocked: boolean;
  bypassLogin: (role: "player" | "owner") => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  // ❤️ Favourites
  toggleFavourite: (turfId: string) => Promise<void>;
  isFavourite: (turfId: string) => boolean;
  favourites: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirestoreBlocked, setIsFirestoreBlocked] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);

  // Load favourites from AsyncStorage on mount
  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
        if (stored) setFavourites(JSON.parse(stored));
      } catch (_) {}
    };
    loadFavourites();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const hasToken = await checkAuthStatus();
        if (hasToken) {
          const profile = await getUserProfile();
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth init error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Handle push notification registration and listeners
  useEffect(() => {
    if (user && user.id) {
      registerForPushNotificationsAsync(user.id);

      const cleanupListeners = addNotificationListeners(
        (notification) => {
          console.log("Notification received:", notification);
        },
        (response) => {
          console.log("Notification response received:", response);
        },
      );

      return cleanupListeners;
    }
  }, [user?.id]);

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Toggle a turf as favourite / unfavourite
  const toggleFavourite = async (turfId: string) => {
    const updated = favourites.includes(turfId)
      ? favourites.filter((id) => id !== turfId)
      : [...favourites, turfId];
    setFavourites(updated);
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
  };

  const isFavourite = (turfId: string) => favourites.includes(turfId);

  const value: AuthContextType = {
    user,
    loading,
    setUser,
    logout,
    isAuthenticated: !!user,
    isFirestoreBlocked,
    favourites,
    toggleFavourite,
    isFavourite,
    bypassLogin: async (role: "player" | "owner") => {
      setLoading(true);
      const dummyUser: User = {
        id: role === "owner" ? "owner-1" : `dev-${role}-123`,
        name: `Dev ${role === "owner" ? "Admin" : "Player"}`,
        email: `dev-${role}@example.com`,
        phone: "+919999999999",
        role: role,
        createdAt: new Date(),
        favoriteTurfs: [],
      };
      setUser(dummyUser);
      setLoading(false);
    },
    updateProfile: async (updates: Partial<User>) => {
      if (!user) return;
      await updateUserProfile(user.id, updates);
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      setUser(updatedUser as User);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
