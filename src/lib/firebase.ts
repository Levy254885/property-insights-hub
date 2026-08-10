import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const env = import.meta.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"] ?? "AIzaSyD_JXcL2ny3G-1yYR5mHbsSGzm1eb-Fk_w",
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] ?? "bigtwo-ltd.firebaseapp.com",
  projectId: env["VITE_FIREBASE_PROJECT_ID"] ?? "bigtwo-ltd",
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] ?? "bigtwo-ltd.firebasestorage.app",
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] ?? "998107016011",
  appId: env["VITE_FIREBASE_APP_ID"] ?? "1:998107016011:web:bd72be6bfff9e8ee1096ce",
};

/** Firebase is initialised lazily and only in the browser: the SSR worker
 * runtime must never construct the web SDK. */
export const isBrowser = typeof window !== "undefined";

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isBrowser) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getDb(): Firestore | null {
  const a = getFirebaseApp();
  return a ? getFirestore(a) : null;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getFirebaseApp();
  return a ? getStorage(a) : null;
}
