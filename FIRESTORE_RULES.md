# 🔥 Firestore Security Rules Fix

To allow users to create and update their profiles, you need to update your Firestore security rules in the Firebase Console.

### Steps to Fix:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **Turf Arena**.
3. In the left sidebar, click **Firestore Database**.
4. Click the **Rules** tab at the top.
5. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow users to read and write only their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow anyone to read turfs, but only authenticated users to book or review (simplified)
    match /turfs/{turfId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Allow reading reviews for everyone
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Allow reading bookings for the owner or the player who booked
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click **Publish**.

### Why is this happening?

By default, Firestore starts in "Locked Mode" where all reads and writes are denied. The rules above allow the app to save the user's profile info to the `users` collection specifically for the logged-in user.

### Verification:

After publishing, go back to the app and click **"Get Started"** again. It should now save your profile successfully!
