import { Booking, Slot } from "@/types";
import { apiFetch } from "./api";

/**
 * Fetch available slots for a turf on a specific date
 * @param turfId - Turf ID
 * @param date - Date string (YYYY-MM-DD)
 * @returns Promise<Slot[]>
 */
export const getSlotsByDate = async (
  turfId: string,
  date: string,
): Promise<Slot[]> => {
  try {
    return await apiFetch(`/slots/${turfId}?date=${date}`);
  } catch (error) {
    console.error("❌ Error fetching slots:", error);
    return [];
  }
};

/**
 * Create a new booking
 * @param bookingData - Booking data
 * @returns Promise<string> - Booking ID
 */
export const createBooking = async (
  bookingData: Omit<Booking, "id" | "createdAt">,
): Promise<string> => {
  try {
    const response = await apiFetch("/bookings", {
      method: "POST",
      body: JSON.stringify({
        turfId: bookingData.turfId,
        date: bookingData.date,
        slots: bookingData.slots,
        totalAmount: bookingData.totalAmount,
      }),
    });
    return response.id;
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    throw error;
  }
};

/**
 * Fetch user bookings
 * @returns Promise<Booking[]>
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const data = await apiFetch("/bookings/my");
    return data.map((b: any) => ({
      ...b,
      createdAt: new Date(b.createdAt),
    }));
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    return [];
  }
};

/**
 * Fetch a single booking by ID
 * @param bookingId - Booking ID
 * @returns Promise<Booking | null>
 */
export const getBookingById = async (
  bookingId: string,
): Promise<Booking | null> => {
  try {
    const b = await apiFetch(`/bookings/${bookingId}`);
    return {
      ...b,
      createdAt: new Date(b.createdAt),
    };
  } catch (error) {
    console.error("❌ Error fetching booking details:", error);
    return null;
  }
};

/**
 * Cancel booking
 * @param bookingId - Booking ID
 * @returns Promise<void>
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    await apiFetch(`/bookings/${bookingId}/cancel`, {
      method: "PUT",
    });
  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    throw error;
  }
};

/**
 * Fetch bookings for all turfs owned by a specific owner
 * @param ownerId - Owner ID
 * @returns Promise<Booking[]>
 */
export const getOwnerBookings = async (ownerId: string): Promise<Booking[]> => {
  try {
    // Note: This relies on fetching turfs first, then bookings per turf.
    const turfs = await apiFetch(`/turfs/owner/${ownerId}`);
    const bookingsPromises = turfs.map((t: any) => apiFetch(`/bookings/turf/${t.id}`));
    const bookingsArrays = await Promise.all(bookingsPromises);
    
    // Flatten and sort by date descending
    const allBookings = bookingsArrays.flat().map((b: any) => ({
      ...b,
      createdAt: new Date(b.createdAt),
    }));
    
    return allBookings.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("❌ Error fetching owner bookings:", error);
    return [];
  }
};

/**
 * Fetch bookings for a specific turf
 * @param turfId - Turf ID
 * @returns Promise<Booking[]>
 */
export const getTurfBookings = async (turfId: string): Promise<Booking[]> => {
  try {
    const data = await apiFetch(`/bookings/turf/${turfId}`);
    return data.map((b: any) => ({
      ...b,
      createdAt: new Date(b.createdAt),
    }));
  } catch (error) {
    console.error("❌ Error fetching turf bookings:", error);
    return [];
  }
};
