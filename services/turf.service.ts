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
    // Return local dummy data as fallback
    return THANJAVUR_DUMMY_TURFS;
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
    // Fallback to local dummy data
    return THANJAVUR_DUMMY_TURFS.find((t) => t.id === id) ?? null;
  }
};

// Alias for backward compatibility (original had a typo)
export const getTurbById = getTurfById;


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
    return THANJAVUR_DUMMY_TURFS.filter((t) => t.ownerId === ownerId);
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
 * Seeding helper - returns local Thanjavur dummy turfs
 */
export const seedDummyTurfs = async () => {
  console.log("ℹ️ Using local Thanjavur dummy data as seed.");
  return THANJAVUR_DUMMY_TURFS;
};

// ─────────────────────────────────────────────────────────────────
// LOCAL DUMMY DATA — Thanjavur, Tamil Nadu
// Used as fallback when backend is unavailable
// ─────────────────────────────────────────────────────────────────
export const THANJAVUR_DUMMY_TURFS: Turf[] = [
  {
    id: "tnj-turf-001",
    name: "Brihadeeswarar Sports Arena",
    ownerId: "owner-1",
    location: {
      latitude: 10.7829,
      longitude: 79.1318,
      address: "Near Brihadeeswarar Temple, South Main St, Thanjavur",
      city: "Thanjavur",
    },
    pricePerHour: 800,
    photos: [
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
    ],
    timing: { start: "06:00", end: "23:00" },
    amenities: [
      "Floodlights",
      "Changing Rooms",
      "Parking",
      "Drinking Water",
      "Washrooms",
    ],
    description:
      "Premium 5-a-side football turf located in the heart of Thanjavur, just minutes from the iconic Brihadeeswarar Temple. Synthetic grass surface with professional floodlights for night games.",
    sportTypes: ["Football", "Cricket"],
    rating: 4.5,
    reviewCount: 38,
    isActive: true,
    stateId: "tamil-nadu",
    regionId: "thanjavur",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "tnj-turf-002",
    name: "Cauvery Kick Arena",
    ownerId: "owner-1",
    location: {
      latitude: 10.7905,
      longitude: 79.1471,
      address: "Cauvery Bank Road, Ayyappan Nagar, Thanjavur",
      city: "Thanjavur",
    },
    pricePerHour: 600,
    photos: [
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe39?w=800",
    ],
    timing: { start: "05:30", end: "22:30" },
    amenities: [
      "Floodlights",
      "Drinking Water",
      "First Aid",
      "Washrooms",
      "Coaching Available",
    ],
    description:
      "Affordable and well-maintained turf by the Cauvery riverside area. Perfect for friendly matches, tournaments, and corporate events. Coaching sessions available on weekends.",
    sportTypes: ["Football", "Futsal"],
    rating: 4.2,
    reviewCount: 62,
    isActive: true,
    stateId: "tamil-nadu",
    regionId: "thanjavur",
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "tnj-turf-003",
    name: "Nayak Royal Cricket Nets",
    ownerId: "owner-2",
    location: {
      latitude: 10.7756,
      longitude: 79.1389,
      address: "Nayak Palace Road, Thanjavur - 613001",
      city: "Thanjavur",
    },
    pricePerHour: 500,
    photos: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
      "https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=800",
      "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800",
    ],
    timing: { start: "06:00", end: "22:00" },
    amenities: [
      "Bowling Machine",
      "Nets (4 lanes)",
      "Changing Rooms",
      "Parking",
      "Canteen",
    ],
    description:
      "Thanjavur's best cricket practice facility with 4 professional batting nets and an automated bowling machine. Ideal for serious cricketers looking to sharpen their skills.",
    sportTypes: ["Cricket"],
    rating: 4.7,
    reviewCount: 91,
    isActive: true,
    stateId: "tamil-nadu",
    regionId: "thanjavur",
    createdAt: new Date("2023-11-10"),
  },
  {
    id: "tnj-turf-004",
    name: "Big Temple Sports Hub",
    ownerId: "owner-2",
    location: {
      latitude: 10.7831,
      longitude: 79.1362,
      address: "Medical College Rd, Thanjavur - 613004",
      city: "Thanjavur",
    },
    pricePerHour: 700,
    photos: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800",
      "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=800",
    ],
    timing: { start: "06:00", end: "23:59" },
    amenities: [
      "Floodlights",
      "Cafeteria",
      "Parking",
      "Changing Rooms",
      "Sports Shop",
      "Washrooms",
    ],
    description:
      "A multi-sport hub near Thanjavur Medical College. Features a full-size football turf, badminton court and a well-lit outdoor basketball zone. Open all night for late players.",
    sportTypes: ["Football", "Badminton", "Basketball"],
    rating: 4.3,
    reviewCount: 47,
    isActive: true,
    stateId: "tamil-nadu",
    regionId: "thanjavur",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "tnj-turf-005",
    name: "Punnainallur Mariamman Turf",
    ownerId: "owner-3",
    location: {
      latitude: 10.8012,
      longitude: 79.1543,
      address: "Punnainallur, NH-36, Thanjavur District",
      city: "Thanjavur",
    },
    pricePerHour: 450,
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
      "https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=800",
    ],
    timing: { start: "06:00", end: "22:00" },
    amenities: [
      "Floodlights",
      "Drinking Water",
      "Parking",
      "Washrooms",
    ],
    description:
      "Budget-friendly turf on the outskirts of Thanjavur near Punnainallur temple. Great for school and college teams. Ample parking space and easy highway access.",
    sportTypes: ["Football", "Kabaddi"],
    rating: 3.9,
    reviewCount: 23,
    isActive: true,
    stateId: "tamil-nadu",
    regionId: "thanjavur",
    createdAt: new Date("2024-04-01"),
  },
  {
    id: "tnj-turf-006",
    name: "Saraswathi Badminton Academy",
    ownerId: "owner-3",
    location: {
      latitude: 10.7866,
      longitude: 79.1292,
      address: "Gandhi Nagar, Near Bus Stand, Thanjavur - 613001",
      city: "Thanjavur",
    },
    pricePerHour: 300,
    photos: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
      "https://images.unsplash.com/photo-1620926751447-7edecf3db2f1?w=800",
      "https://images.unsplash.com/photo-1600881338943-f4e4dc5e8a80?w=800",
    ],
    timing: { start: "05:00", end: "22:00" },
    amenities: [
      "3 Indoor Courts",
      "AC Hall",
      "Coaching",
      "Racket Rental",
      "Changing Rooms",
      "Parking",
    ],
    description:
      "Thanjavur's most popular indoor badminton academy with 3 synthetic courts under air-conditioned comfort. Professional coaching available for all skill levels, from beginners to competitive players.",
    sportTypes: ["Badminton"],
    rating: 4.8,
    reviewCount: 114,
    isActive: true,
    stateId: "tamil-nadu",
    regionId: "thanjavur",
    createdAt: new Date("2023-08-15"),
  },
];
