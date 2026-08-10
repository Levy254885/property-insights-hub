import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import { useAuth } from "./auth";

const STORAGE_KEY = "pm.favorites";

interface FavoritesValue {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Guests keep favourites in local storage; signed-in users sync to Firestore.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw) as string[]);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    const db = getDb();
    if (!user || !db) return;
    void (async () => {
      try {
        const ref = doc(db, "favorites", user.uid);
        const snap = await getDoc(ref);
        const remote = snap.exists() ? ((snap.data() as { ids?: string[] }).ids ?? []) : [];
        const local = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
        const merged = Array.from(new Set([...remote, ...local]));
        setFavorites(merged);
        await setDoc(ref, { ids: merged, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (error) {
        console.warn("[property-masters] favourites sync unavailable", error);
      }
    })();
  }, [user]);

  const persist = useCallback(
    (next: string[]) => {
      setFavorites(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage may be unavailable */
      }
      const db = getDb();
      if (user && db) {
        void setDoc(
          doc(db, "favorites", user.uid),
          { ids: next, updatedAt: new Date().toISOString() },
          { merge: true },
        ).catch(() => undefined);
      }
    },
    [user],
  );

  const value = useMemo<FavoritesValue>(
    () => ({
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite: (id) =>
        persist(favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]),
      clearFavorites: () => persist([]),
    }),
    [favorites, persist],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
