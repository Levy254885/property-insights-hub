import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";
import {
  agents as seedAgents,
  demoArticles,
  demoProperties,
  locations as seedLocations,
  propertyTypes as seedTypes,
} from "@/data/seed";
import type {
  Agent,
  Article,
  Enquiry,
  LocationArea,
  Property,
  PropertyImage,
  PropertyType,
  ViewingRequest,
} from "./types";

/**
 * Data access layer for the Property Masters internal inventory.
 *
 * Properties are company-owned records maintained by staff through the admin
 * dashboard. Demo seed records are used as a fallback so the site renders
 * during SSR and before the Firestore collections are populated.
 */

async function readCollection<T>(name: string): Promise<T[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, name));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as T);
  } catch (error) {
    console.warn(`[property-masters] could not read "${name}" from Firestore`, error);
    return [];
  }
}

export async function fetchProperties(): Promise<Property[]> {
  const remote = await readCollection<Property>("properties");
  return remote.length ? remote : demoProperties;
}

export async function fetchPropertyTypes(): Promise<PropertyType[]> {
  const remote = await readCollection<PropertyType>("propertyTypes");
  return remote.length ? remote : seedTypes;
}

export async function fetchLocations(): Promise<LocationArea[]> {
  const remote = await readCollection<LocationArea>("locations");
  return remote.length ? remote : seedLocations;
}

/** Property specialists are internal Property Masters staff. */
export async function fetchSpecialists(): Promise<Agent[]> {
  const remote = await readCollection<Agent>("propertySpecialists");
  return remote.length ? remote : seedAgents;
}

export async function fetchArticles(): Promise<Article[]> {
  const remote = await readCollection<Article>("articles");
  return remote.length ? remote : demoArticles;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  return readCollection<Enquiry>("enquiries");
}

export async function fetchViewingRequests(): Promise<ViewingRequest[]> {
  return readCollection<ViewingRequest>("viewingRequests");
}

export async function fetchUsers(): Promise<
  Array<{ id: string; email?: string; displayName?: string; role?: string; createdAt?: string }>
> {
  return readCollection("users");
}

function requireDb() {
  const db = getDb();
  if (!db) throw new Error("Database is unavailable in this environment.");
  return db;
}

/**
 * Firestore rejects `undefined` values, which optional form fields produce
 * constantly (an empty bedroom count, no land size, no SEO override...).
 * Strip them out recursively before every write.
 */
function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => clean(v)) as unknown as T;
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = clean(v);
    }
    return out as T;
  }
  return value;
}

export async function createEnquiry(payload: Omit<Enquiry, "id">): Promise<string> {
  const db = requireDb();
  const ref = await addDoc(collection(db, "enquiries"), {
    ...clean(payload),
    _createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEnquiryStatus(id: string, status: Enquiry["status"]): Promise<void> {
  await updateDoc(doc(requireDb(), "enquiries", id), { status });
}

export async function createViewingRequest(payload: Omit<ViewingRequest, "id">): Promise<string> {
  const db = requireDb();
  const ref = await addDoc(collection(db, "viewingRequests"), {
    ...clean(payload),
    _createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateViewingStatus(id: string, status: ViewingRequest["status"]): Promise<void> {
  await updateDoc(doc(requireDb(), "viewingRequests", id), { status });
}

export async function saveProperty(property: Property): Promise<void> {
  const db = requireDb();
  const { id, ...rest } = clean(property);
  await setDoc(doc(db, "properties", id), { ...rest, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function patchProperty(id: string, patch: Partial<Property>): Promise<void> {
  await setDoc(
    doc(requireDb(), "properties", id),
    { ...clean(patch), updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

/** Removes the record and any photographs it holds in cloud storage. */
export async function deleteProperty(id: string, images: PropertyImage[] = []): Promise<void> {
  await deleteDoc(doc(requireDb(), "properties", id));
  const { deletePropertyImage } = await import("./storage");
  await Promise.all(images.map((image) => deletePropertyImage(image)));
}

export async function saveSpecialist(specialist: Agent): Promise<void> {
  const db = requireDb();
  const { id, ...rest } = specialist;
  await setDoc(doc(db, "propertySpecialists", id), rest, { merge: true });
}

export async function saveLocation(location: LocationArea): Promise<void> {
  const db = requireDb();
  const { id, ...rest } = location;
  await setDoc(doc(db, "locations", id), rest, { merge: true });
}

export async function savePropertyType(type: PropertyType): Promise<void> {
  const db = requireDb();
  const { id, ...rest } = type;
  await setDoc(doc(db, "propertyTypes", id), rest, { merge: true });
}

export async function saveArticle(article: Article): Promise<void> {
  const db = requireDb();
  const { id, ...rest } = article;
  await setDoc(doc(db, "articles", id), rest, { merge: true });
}

export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  await setDoc(doc(requireDb(), "settings", "site"), settings, { merge: true });
}
