import AsyncStorage from "@react-native-async-storage/async-storage";

// Using 10.0.2.2 for Android Emulator to access localhost, use localhost for iOS/Web.
// Adjust this to your machine's IP address if testing on a physical device.
export const API_BASE_URL = "https://localhost:7155/api"; // ASP.NET Core HTTPS port

export const getAuthToken = async () => {
  return await AsyncStorage.getItem("jwt_token");
};

export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem("jwt_token", token);
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem("jwt_token");
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized (e.g., redirect to login)
    await removeAuthToken();
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }
    return data;
  }

  if (!response.ok) {
    throw new Error("An error occurred");
  }

  return response;
};
