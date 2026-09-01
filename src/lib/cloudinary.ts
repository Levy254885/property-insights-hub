import type { PropertyImage } from "./types";

/**
 * Cloudinary unsigned uploads.
 *
 * Property photography is uploaded straight from the admin dashboard to
 * Cloudinary, which serves it publicly over its CDN. That means every image an
 * administrator adds is immediately visible to every visitor — no storage
 * rules, no signed URLs, no per-viewer permissions.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const CLOUDINARY_CLOUD_NAME = env["VITE_CLOUDINARY_CLOUD_NAME"] ?? "dozqfm7t";
export const CLOUDINARY_UPLOAD_PRESET = env["VITE_CLOUDINARY_UPLOAD_PRESET"] ?? "property_masters";

export function uploadToCloudinary(
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
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading the image."));
    xhr.onload = () => {
      let body: Record<string, unknown> = {};
      try {
        body = JSON.parse(xhr.responseText) as Record<string, unknown>;
      } catch {
        /* ignore */
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        const message =
          ((body["error"] as { message?: string } | undefined)?.message) ??
          `Upload failed (${xhr.status}).`;
        reject(new Error(message));
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
