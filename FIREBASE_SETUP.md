# Firebase Configuration Instructions

## Setup Steps

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Enter project name: "turf-arena"
   - Enable/Disable Google Analytics as preferred
   - Click "Create project"

2. **Add Web App**
   - In Firebase Console, click the web icon (</>)
   - Register app nickname: "Turf Arena App"
   - No need to set up Firebase Hosting
   - Copy the firebaseConfig object

3. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Phone" authentication
   - Add test phone numbers for development (if needed)
   - Enable "Google" authentication (optional)

4. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** for development
   - Select region closest to India (asia-south1)

5. **Enable Storage**
   - Go to Storage
   - Click "Get started"
   - Start in test mode
   - Use default location

6. **Get Android SHA-1** (for Phone Auth on Android)

   ```bash
   cd android
   ./gradlew signingReport
   # Copy SHA-1 fingerprint
   # Add it in Firebase Console > Project Settings > Your apps > Android app
   ```

7. **Download Config Files**
   - Download `google-services.json` for Android → place in `android/app/`
   - Download `GoogleService-Info.plist` for iOS → place in `ios/`

8. **Create .env file**
   Copy the firebaseConfig values to .env file in project root

## .env Template

Create a `.env` file in the project root with:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Google Maps API Key (to be added later)
GOOGLE_MAPS_API_KEY=your_maps_api_key_here

# Razorpay Keys (to be added in Phase 2)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Security Rules (to be added after initial testing)

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == userId;
    }

    // Turfs collection
    match /turfs/{turfId} {
      allow read: if true; // Public read
      allow create, update: if request.auth != null &&
        (request.auth.uid == resource.data.ownerId || !exists(/databases/$(database)/documents/turfs/$(turfId)));
      allow delete: if request.auth.uid == resource.data.ownerId;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId ||
        request.auth.uid == get(/databases/$(database)/documents/turfs/$(resource.data.turfId)).data.ownerId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId ||
        request.auth.uid == get(/databases/$(database)/documents/turfs/$(resource.data.turfId)).data.ownerId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    match /turfs/{turfId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Notes

- Keep `.env` file in `.gitignore`
- Start with test mode for Firestore and Storage
- Add security rules after initial development
- Use emulators for local development:
  ```bash
  firebase emulators:start
  ```
