# Turf Arena

Turf Arena is a premium React Native mobile application for booking and managing sports turfs. It features an ultra-modern dark mode aesthetic ("Midnight Deep"), real-time availability tracking, dynamic slot generation, and a seamless booking experience for both players and turf owners.

## 🚀 Recent Architecture Migration

Turf Arena recently transitioned from a local-only prototype (using `AsyncStorage` and Firebase Auth) to a robust **Client-Server Architecture**.

### New Tech Stack
*   **Frontend**: React Native (Expo)
*   **Backend**: ASP.NET Core 8 Web API
*   **Database**: SQL Server with Entity Framework Core
*   **Authentication**: Custom JWT Bearer Tokens (Replaced Firebase)
*   **Media**: Cloudinary (Image Uploads)

---

## 📁 Frontend File Structure

```text
turf-arena/
├── app/                      # Expo Router Page Components
│   ├── index.tsx             # Entry point / Home feed
│   ├── turf-details.tsx      # Detailed view of a turf
│   ├── select-slots.tsx      # Slot selection and calendar UI
│   ├── booking-summary.tsx   # Checkout and payment review
│   └── (auth)/               # Authentication screens (Login/Register)
├── components/               # Reusable UI Components
│   └── ui/
│       ├── SlotGrid.tsx      # Interactive slot selection grid
│       └── ...
├── context/                  # Global State Management
│   └── AuthContext.tsx       # JWT Auth session manager
├── services/                 # API Client Layer (Replaced AsyncStorage)
│   ├── api.ts                # Centralized HTTP client with JWT interceptors
│   ├── auth.service.ts       # Login, Register, Profile API calls
│   ├── turf.service.ts       # Turf CRUD API calls
│   ├── booking.service.ts    # Slot checking and booking API calls
│   └── review.service.ts     # Ratings and reviews API calls
├── types/                    # TypeScript Interface Definitions
│   └── index.ts              # Core Data Models (User, Turf, Booking, Slot)
├── assets/                   # Static images, fonts, icons
└── app.json                  # Expo Configuration
```

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
*   Node.js (v18+)
*   Expo CLI
*   The **Turf Arena ASP.NET Core Backend** must be running locally.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Hari021101/TurfArena_Front-end.git
cd turf-arena
npm install
```

### 3. API Configuration
The frontend communicates with the local ASP.NET Core API. The base URL is configured in `services/api.ts`:
```typescript
// For Android Emulator targeting local API:
export const API_BASE_URL = "https://10.0.2.2:7085/api"; 
// For iOS Simulator / Web:
// export const API_BASE_URL = "https://localhost:7085/api";
```

### 4. Running the App
Start the Expo development server:
```bash
npm start
```
Press `a` to open in Android Emulator, `i` for iOS Simulator, or scan the QR code with the Expo Go app.

---

## 🗺️ Project Roadmap & Migration Plan

We successfully completed the Phase 1-8 migration plan to connect this frontend to a real database.

- [x] **Phase 1-2**: ASP.NET Core Setup & SQL Server EF Core Data Models.
- [x] **Phase 3**: Custom JWT Authentication API.
- [x] **Phase 4-7**: Turf, Slot Generation, Booking, and Review APIs.
- [x] **Phase 8**: Refactored React Native `services/` to use `fetch` instead of `AsyncStorage`.
- [ ] **Phase 9**: Database Migrations & End-to-End Testing.
- [ ] **Phase 10**: Integrate real Payment Gateway (e.g., Razorpay/Stripe).
