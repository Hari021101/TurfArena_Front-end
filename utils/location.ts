import * as Location from "expo-location";

/**
 * Request location permissions
 * @returns Promise<boolean>
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

/**
 * Get current user location
 * @returns Promise<Location.LocationObject | null>
 */
export const getCurrentLocation =
  async (): Promise<Location.LocationObject | null> => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;

      return await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

/**
 * Get address from coordinates (Reverse Geocoding)
 * @param latitude
 * @param longitude
 * @returns Promise<string>
 */
export const getAddressFromCoords = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const result = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (result.length > 0) {
      const { name, street, city, region, postalCode } = result[0];
      return `${name || ""}, ${street || ""}, ${city || ""}, ${region || ""} ${postalCode || ""}`
        .replace(/^, /, "")
        .trim();
    }
    return "Unknown Location";
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return "Unknown Location";
  }
};

/**
 * Calculate distance between two points in KM
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns number (distance in km)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10; // Round to 1 decimal place
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
