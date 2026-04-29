import { Turf } from "@/types";
import { apiFetch } from "./api";
import { uploadToCloudinary } from "./cloudinary.service";

/**
 * Fetch all active turfs
 * @param city - Optional city filter
 * @returns Promise<Turf[]>
 */
export const getAllTurfs = async (city?: string): Promise<Turf[]> => {
  try {
    const endpoint = city ? `/turfs?city=${encodeURIComponent(city)}` : "/turfs";
    const data = await apiFetch(endpoint);
    return data.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error("❌ Error fetching turfs:", error);
    return [];
  }
};

/**
 * Get turf by ID
 * @param id - Turf ID
 * @returns Promise<Turf | null>
 */
export const getTurfById = async (id: string): Promise<Turf | null> => {
  try {
    const t = await apiFetch(`/turfs/${id}`);
    return {
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
    };
  } catch (error) {
    console.error("❌ Error fetching turf details:", error);
    return null;
  }
};

/**
 * Get turfs by owner ID
 * @param ownerId - Owner ID
 * @returns Promise<Turf[]>
 */
export const getTurfsByOwner = async (ownerId: string): Promise<Turf[]> => {
  try {
    const data = await apiFetch(`/turfs/owner/${ownerId}`);
    return data.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error("❌ Error fetching owner turfs:", error);
    return [];
  }
};

/**
 * Create a new turf listing
 * @param turfData - Partial turf data
 * @returns Promise<string> - The new turf ID
 */
export const createTurf = async (turfData: Partial<Turf>): Promise<string> => {
  try {
    const newTurf = await apiFetch("/turfs", {
      method: "POST",
      body: JSON.stringify(turfData),
    });
    return newTurf.id;
  } catch (error) {
    console.error("❌ Error creating turf:", error);
    throw error;
  }
};

/**
 * Update an existing turf listing
 * @param id - Turf ID
 * @param turfData - Data to update
 */
export const updateTurf = async (
  id: string,
  turfData: Partial<Turf>,
): Promise<void> => {
  try {
    await apiFetch(`/turfs/${id}`, {
      method: "PUT",
      body: JSON.stringify(turfData),
    });
  } catch (error) {
    console.error("❌ Error updating turf:", error);
    throw error;
  }
};

/**
 * Upload multiple turf images to Cloudinary
 * @param uris - Array of local image URIs
 * @returns Promise<string[]> - Array of Cloudinary URLs
 */
export const uploadTurfImages = async (uris: string[]): Promise<string[]> => {
  const uploadPromises = uris.map((uri) => uploadToCloudinary(uri));
  const results = await Promise.all(uploadPromises);
  return results.filter((url: string | null): url is string => url !== null);
};

/**
 * Search turfs by city
 * @param city - City name
 * @returns Promise<Turf[]>
 */
export const searchTurfsByCity = async (city: string): Promise<Turf[]> => {
  return getAllTurfs(city);
};

/**
 * Seeding helper function (No longer used locally, backend handles this if needed)
 */
export const seedDummyTurfs = async () => {
  console.log("ℹ️ Seeding should be done on the backend now.");
};
