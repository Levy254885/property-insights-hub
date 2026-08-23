import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const env = import.meta.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"] ?? "AIzaSyA2ShN6bXeQOE5vdW4IZwXCkMglgpuj-bY",
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] ?? "property-masters-ke.firebaseapp.com",
  projectId: env["VITE_FIREBASE_PROJECT_ID"] ?? "property-masters-ke",
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] ?? "property-masters-ke.firebasestorage.app",
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] ?? "597599704547",
  appId: env["VITE_FIREBASE_APP_ID"] ?? "1:597599704547:web:f12741c1b79d0bc6a1fcd6",
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
