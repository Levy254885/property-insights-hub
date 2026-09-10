import { firebaseConfig } from "./firebase";

/**
 * SSR-safe Firestore reads.
 *
 * The Firebase web SDK only runs in the browser, but search engines need the
 * real listing content and metadata in the server-rendered HTML. The public
 * Firestore REST API gives us exactly the same world-readable catalogue data
 * with a plain `fetch`, so route loaders and the sitemap can use it during SSR.
 */

const BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

type FirestoreValue = Record<string, unknown>;

function decode(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value["stringValue"];
  if ("integerValue" in value) return Number(value["integerValue"]);
  if ("doubleValue" in value) return Number(value["doubleValue"]);
  if ("booleanValue" in value) return Boolean(value["booleanValue"]);
  if ("timestampValue" in value) return String(value["timestampValue"]);
  if ("nullValue" in value) return undefined;
  if ("arrayValue" in value) {
    const arr = (value["arrayValue"] as { values?: FirestoreValue[] }).values ?? [];
    return arr.map(decode);
  }
  if ("mapValue" in value) {
    const fields = (value["mapValue"] as { fields?: Record<string, FirestoreValue> }).fields ?? {};
    return decodeFields(fields);
  }
  return undefined;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    const decoded = decode(value);
    if (decoded !== undefined) out[key] = decoded;
  }
  return out;
}

interface RestDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

/**
 * Reads a world-readable collection. Returns an empty array on any failure so
 * that a network problem can never break a page render — callers fall back to
 * the data they already hold.
 */
export async function restCollection<T>(name: string, pageSize = 300): Promise<T[]> {
  try {
    const url = `${BASE}/${name}?pageSize=${pageSize}&key=${firebaseConfig.apiKey}`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) return [];
    const body = (await response.json()) as { documents?: RestDocument[] };
    return (body.documents ?? []).map((doc) => ({
      id: doc.name.split("/").pop(),
      ...decodeFields(doc.fields ?? {}),
    })) as T[];
  } catch {
    return [];
  }
}
