// Type definitions for Turf Arena App

export type UserRole = "player" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
  favoriteTurfs?: string[];
  pushToken?: string;
  createdAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

export interface Timing {
  start: string; // HH:mm format (e.g., "06:00")
  end: string; // HH:mm format (e.g., "23:00")
}

export interface Turf {
  id: string;
  name: string;
  ownerId: string;
  location: Location;
  pricePerHour: number;
  photos: string[];
  timing: Timing;
  amenities: string[];
  description: string;
  sportTypes?: string[];
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  stateId?: string;
  regionId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type SlotStatus = "available" | "booked";

export interface Slot {
  id: string;
  turfId: string;
  date: string; // YYYY-MM-DD format
  time: string; // "HH:mm - HH:mm" format (e.g., "06:00 - 07:00")
  status: SlotStatus;
  price?: number;
}

export type BookingStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "pending_payment";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  turfName?: string; // Denormalized for easier display
  turfPhoto?: string; // Denormalized for easier display
  date: string; // YYYY-MM-DD format
  slots: string[]; // Array of time strings
  totalAmount: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  createdAt: Date;
  updatedAt?: Date;
  cancelledAt?: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: PaymentStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string; // Denormalized
  userPhoto?: string; // Denormalized
  turfId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "flat";
  minBookingAmount: number;
  maxDiscount?: number;
  expiryDate: Date;
  isActive: boolean;
}
