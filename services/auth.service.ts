import { User } from "@/types";
import { apiFetch, getAuthToken, removeAuthToken, setAuthToken } from "./api";

/**
 * Sign in with Email and Password
 * @param email - User email
 * @param password - User password
 * @returns Promise<User> - Authenticated user profile
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await setAuthToken(response.token);
    return response.user;
  } catch (error) {
    console.error("❌ Error with Sign-In:", error);
    throw error;
  }
};

/**
 * Register a new user
 * @param userData - User details (name, email, phone, password, role)
 * @returns Promise<User> - New user profile
 */
export const registerUser = async (userData: any): Promise<User> => {
  try {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    await setAuthToken(response.token);
    return response.user;
  } catch (error) {
    console.error("❌ Error with Registration:", error);
    throw error;
  }
};

/**
 * Get current user profile from API
 * @returns Promise<User | null> - User profile or null
 */
export const getUserProfile = async (userId?: string): Promise<User | null> => {
  try {
    const user = await apiFetch("/auth/me");
    if (user.createdAt) user.createdAt = new Date(user.createdAt);
    if (user.updatedAt) user.updatedAt = new Date(user.updatedAt);
    return user;
  } catch (error) {
    console.error("❌ Error getting user profile:", error);
    return null;
  }
};

/**
 * Update user profile via API
 * @param userId - User ID (kept for compatibility)
 * @param updates - Partial user data to update
 * @returns Promise<void>
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>,
): Promise<void> => {
  try {
    await apiFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    console.log("✅ User profile updated via API");
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
};

/**
 * Logout user by removing JWT token
 * @returns Promise<void>
 */
export const logout = async (): Promise<void> => {
  try {
    await removeAuthToken();
    console.log("✅ User logged out");
  } catch (error) {
    console.error("❌ Error logging out:", error);
    throw error;
  }
};

/**
 * Check if user is authenticated (has token)
 * @returns Promise<boolean>
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};
