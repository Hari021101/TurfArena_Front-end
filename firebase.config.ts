import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

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

// Initialize Auth with persistence for React Native
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

console.log("✅ Firebase initialized successfully");

export { app, auth, db, storage };

