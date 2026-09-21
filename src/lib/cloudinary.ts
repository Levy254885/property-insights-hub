import type { PropertyImage } from "./types";

/**
 * Cloudinary unsigned uploads.
 *
 * Property photography is uploaded straight from the admin dashboard to
 * Cloudinary, which serves it publicly over its CDN.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const CLOUDINARY_CLOUD_NAME = env["VITE_CLOUDINARY_CLOUD_NAME"] ?? "dozqfm7t";
export const CLOUDINARY_UPLOAD_PRESET = env["VITE_CLOUDINARY_UPLOAD_PRESET"] ?? "property_masters";

const MAX_EDGE_PX = 2400;
const JPEG_QUALITY = 0.82;
const UPLOAD_TIMEOUT_MS = 120_000;
const MAX_ATTEMPTS = 3;

/**
 * Shrink large phone photos before upload so batches stay under Cloudinary /
 * browser limits. Small files are returned unchanged.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  // Skip non-raster or already-modest files
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  if (file.size < 1.2 * 1024 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_EDGE_PX / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function postOnce(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
): Promise<PropertyImage> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if (folder) form.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.ontimeout = () =>
      reject(new Error("Upload timed out. Check your connection and try again."));

    xhr.onerror = () =>
      reject(
        new Error(
          "Network error while uploading. This often happens on slow connections or when many large photos are sent at once — Retry usually works.",
        ),
      );

    xhr.onabort = () => reject(new Error("Upload was cancelled."));

    xhr.onload = () => {
      let body: Record<string, unknown> = {};
      try {
        body = JSON.parse(xhr.responseText) as Record<string, unknown>;
      } catch {
        /* ignore */
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        const apiMsg = (body["error"] as { message?: string } | undefined)?.message;
        reject(new Error(apiMsg ?? `Upload failed (HTTP ${xhr.status}).`));
        return;
      }
      resolve({
        url: String(body["secure_url"] ?? ""),
        path: String(body["public_id"] ?? ""),
        alt: "",
        filename: file.name,
        size: file.size,
        ...(typeof body["width"] === "number" ? { width: body["width"] as number } : {}),
        ...(typeof body["height"] === "number" ? { height: body["height"] as number } : {}),
        uploadedAt: new Date().toISOString(),
      });
    };

    xhr.send(form);
  });
}

/**
 * Compress → upload with automatic retries (handles flaky mobile networks).
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
): Promise<PropertyImage> {
  const prepared = await prepareImageForUpload(file);
  let lastError: Error = new Error("Upload failed.");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      onProgress?.(attempt === 1 ? 0 : 5);
      return await postOnce(prepared, folder, onProgress);
    } catch (err) {
      lastError = err as Error;
      const msg = lastError.message.toLowerCase();
      const retriable =
        msg.includes("network") ||
        msg.includes("timed out") ||
        msg.includes("timeout") ||
        msg.includes("429") ||
        msg.includes("rate");

      if (!retriable || attempt === MAX_ATTEMPTS) break;
      // Back off: 1s, 2.5s
      await sleep(1000 * attempt + 500);
    }
  }

  throw lastError;
}

/**
 * Returns a CDN-optimised variant of a Cloudinary URL. Any other URL
 * (Firebase Storage, bundled demo asset, external) is passed through unchanged.
 */
export function optimizedUrl(url: string | undefined, width?: number): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url ?? "";
  if (/\/upload\/(f_auto|q_auto|w_\d)/.test(url)) return url;
  const transform = ["f_auto", "q_auto", width ? `w_${width}` : "", width ? "c_limit" : ""]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${transform}/`);
}
