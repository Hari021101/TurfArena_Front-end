# Turf Arena - Database Schema Documentation (Phase 1)

This document outlines the Firestore collection structure for the Turf Arena app.

## Collections

### 1. `users`

Stores user profile information.

- `id`: string (Firebase UID)
- `name`: string
- `phone`: string
- `role`: "player" | "owner"
- `profilePicture`: string (Storage URL)
- `favoriteTurfs`: string[] (Array of turf IDs)
- `createdAt`: timestamp

### 2. `turfs`

Stores turf arena listings.

- `id`: string
- `name`: string
- `ownerId`: string (Reference to user ID)
- `location`:
  - `latitude`: number
  - `longitude`: number
  - `address`: string
  - `city`: string
- `pricePerHour`: number
- `photos`: string[] (Array of storage URLs)
- `timing`:
  - `start`: string (e.g., "06:00")
  - `end`: string (e.g., "23:00")
- `amenities`: string[] (e.g., ["Parking", "Water", "Changing Room"])
- `description`: string
- `rating`: number
- `isActive`: boolean
- `createdAt`: timestamp

### 3. `slots`

Tracks availability of specific slots to handle concurrency.

- `id`: string
- `turfId`: string (Reference to turf ID)
- `date`: string (YYYY-MM-DD)
- `time`: string (e.g., "06:00 - 07:00")
- `status`: "available" | "booked"

### 4. `bookings`

Records transactions and reserved slots.

- `id`: string
- `userId`: string (Reference to user ID)
- `turfId`: string (Reference to turf ID)
- `turfName`: string (Denormalized for display)
- `turfPhoto`: string (Denormalized for display)
- `date`: string (YYYY-MM-DD)
- `slots`: string[] (Array of time slots)
- `totalAmount`: number
- `status`: "confirmed" | "completed" | "cancelled"
- `paymentStatus`: "pending" | "paid" | "failed"
- `createdAt`: timestamp
- `cancelledAt`: timestamp (optional)

## Future Enhancements (Phase 2)

### 5. `reviews`

- `userId`: string
- `turfId`: string
- `bookingId`: string
- `rating`: number
- `comment`: string
- `createdAt`: timestamp

### 6. `coupons`

- `code`: string
- `discount`: number
- `type`: "percentage" | "flat"
- `expiryDate`: timestamp
- `isActive`: boolean
