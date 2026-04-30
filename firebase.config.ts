import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
// @ts-ignore - getReactNativePersistence exists at runtime in firebase v11+
import { getReactNativePersistence } from "firebase/auth";
import {
  Firestore,
  getFirestore,
  initializeFirestore,
} from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5SSXpu1pBrS6CKhitHzxMHn5egjW2rpo",
  authDomain: "turfarena-5564a.firebaseapp.com",
  projectId: "turfarena-5564a",
  storageBucket: "turfarena-5564a.firebasestorage.app",
  messagingSenderId: "158260737782",
  appId: "1:158260737782:web:a953f3e2c2431636ec9ed7",
  measurementId: "G-WZ993RL3L7",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore with long-polling and local cache for Web
let db: Firestore;
if (Platform.OS === "web") {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} else {
  db = getFirestore(app);
}

const storage: FirebaseStorage = getStorage(app);

console.log("✅ Firebase initialized successfully");

export { app, auth, db, storage };

