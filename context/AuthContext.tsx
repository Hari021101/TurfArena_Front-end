// Authentication Context for global state management
import {
  logout as authLogout,
  getUserProfile,
  updateUserProfile,
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isFirestoreBlocked: boolean; // Kept for compatibility if used in components
  bypassLogin: (role: "player" | "owner") => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirestoreBlocked, setIsFirestoreBlocked] = useState(false);

  useEffect(() => {
    // Check local token and fetch user profile from API
    const initAuth = async () => {
      try {
        const userProfile = await getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
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

  const value: AuthContextType = {
    user,
    loading,
    setUser,
    logout,
    isAuthenticated: !!user,
    isFirestoreBlocked,
    bypassLogin: async (role: "player" | "owner") => {
      setLoading(true);
      // Create dummy user
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
      // Update local state
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
