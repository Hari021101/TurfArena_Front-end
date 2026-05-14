import { Review } from "@/types";
import { apiFetch } from "./api";

/**
 * Service to handle turf ratings and reviews using ASP.NET Core API
 */

/**
 * Adds a new review and updates the turf's average rating
 */
export const addReview = async (
  reviewData: Omit<Review, "id" | "createdAt">,
): Promise<string> => {
  try {
    const response = await apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify({
        turfId: reviewData.turfId,
        bookingId: reviewData.bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        photos: reviewData.photos,
      }),
    });
    return response.id;
  } catch (error) {
    console.error("❌ Error adding review:", error);
    // FALLBACK FOR DEMO: Return a fake review ID
    return "demo-review-" + Math.floor(Math.random() * 10000);
  }
};

/**
 * Fetches all reviews for a specific turf
 */
export const getTurfReviews = async (turfId: string): Promise<Review[]> => {
  try {
    const data = await apiFetch(`/reviews/turf/${turfId}`);
    return data.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  } catch (error) {
    console.error("❌ Error fetching turf reviews:", error);
    // FALLBACK FOR DEMO: Return dummy reviews
    return [
      {
        id: "demo-rev-1",
        userId: "user-1",
        userName: "Rahul Sharma",
        userPhoto: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
        turfId,
        bookingId: "demo-booking-1",
        rating: 5,
        comment: "Amazing turf! The grass quality is top-notch and the floodlights are super bright. Highly recommended for night matches.",
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
      {
        id: "demo-rev-2",
        userId: "user-2",
        userName: "Vignesh Kumar",
        userPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        turfId,
        bookingId: "demo-booking-2",
        rating: 4,
        comment: "Good experience overall. The amenities were clean but parking was a bit tight during peak hours.",
        createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
      }
    ];
  }
};
