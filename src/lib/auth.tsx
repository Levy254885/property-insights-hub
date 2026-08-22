import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth } from "./firebase";
import type { UserRole } from "./types";

/**
 * Authentication exists only for internal Property Masters staff.
 * Visitors never need an account to browse property or send an enquiry, and
 * there is no public sign-up: staff accounts are provisioned by an
 * administrator in Firebase Auth with a matching `users/{uid}` role document.
 */
interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  bootstrapAdmin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Authentication is unavailable in this environment.");
  return auth;
}

async function readRole(user: User): Promise<UserRole | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return null;
    const role = (snap.data() as { role?: UserRole }).role;
    return role === "staff" || role === "admin" || role === "super_admin" ? role : null;
  } catch (error) {
    console.warn("[property-masters] could not resolve staff role", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      if (next) {
        void readRole(next).then(setRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  }, []);

  /**
   * One-time provisioning of the first administrator. Creates the Firebase Auth
   * user (no email verification required) and its `users/{uid}` role document.
   */
  const bootstrapAdmin = useCallback(async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
    const db = getDb();
    if (db) {
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        role: "super_admin",
        createdAt: serverTimestamp(),
      });
    }
    setRole("super_admin");
  }, []);

  const logout = useCallback(async () => {
    await signOut(requireAuth());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      isStaff: role !== null,
      isAdmin: role === "admin" || role === "super_admin",
      signIn,
      bootstrapAdmin,
      logout,
    }),
    [user, role, loading, signIn, bootstrapAdmin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
