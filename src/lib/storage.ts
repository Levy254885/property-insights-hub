import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseStorage } from "./firebase";
import type { PropertyImage } from "./types";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name}: only JPG, PNG or WebP images are accepted.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${file.name}: file is larger than 10MB.`;
  }
  return null;
}

function requireStorage() {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("File storage is unavailable in this environment.");
  return storage;
}

/**
 * Uploads a single property photograph to Firebase Storage (persistent cloud
 * object storage — never the app filesystem) and returns its metadata record.
 */
export function uploadPropertyImage(
  propertyId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<PropertyImage> {
  const storage = requireStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `properties/${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({
            url,
            path,
            alt: "",
            filename: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        } catch (error) {
          reject(error as Error);
        }
      },
    );
  });
}

export async function deletePropertyImage(image: PropertyImage): Promise<void> {
  if (!image.path) return;
  try {
    await deleteObject(ref(requireStorage(), image.path));
  } catch (error) {
    console.warn("[property-masters] could not delete stored image", error);
  }
}
