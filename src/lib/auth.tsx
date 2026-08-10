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
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth } from "./firebase";
import type { UserRole } from "./types";

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Authentication is unavailable in this environment.");
  return auth;
}

async function ensureUserRecord(user: User): Promise<UserRole> {
  const db = getDb();
  if (!db) return "customer";
  const ref = doc(db, "users", user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return ((snap.data() as { role?: UserRole }).role ?? "customer") as UserRole;
    }
    await setDoc(ref, {
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      role: "customer" satisfies UserRole,
      createdAt: new Date().toISOString(),
    });
    return "customer";
  } catch (error) {
    console.warn("[property-masters] could not resolve user role", error);
    return "customer";
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
        void ensureUserRecord(next).then(setRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    await ensureUserRecord(cred.user);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const cred = await signInWithPopup(requireAuth(), new GoogleAuthProvider());
    await ensureUserRecord(cred.user);
  }, []);

  const logout = useCallback(async () => {
    await signOut(requireAuth());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      isAdmin: role === "admin" || role === "super_admin",
      signIn,
      signUp,
      signInWithGoogle,
      logout,
    }),
    [user, role, loading, signIn, signUp, signInWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
