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
      }),
    });
    return response.id;
  } catch (error) {
    console.error("❌ Error adding review:", error);
    throw error;
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
    return [];
  }
};
