import type { ListingType, Property } from "./types";

const kes = new Intl.NumberFormat("en-KE", {
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number, listingType: ListingType): string {
  const base = `KES ${kes.format(amount)}`;
  return listingType === "rent" ? `${base} / month` : base;
}

export function formatCompactPrice(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  if (amount >= 1_000) return `KES ${Math.round(amount / 1_000)}K`;
  return `KES ${kes.format(amount)}`;
}

export function formatSize(value: number | undefined, unit: Property["sizeUnit"]): string | null {
  if (!value) return null;
  const label = unit === "acres" ? "acres" : unit === "sqft" ? "sq ft" : "m²";
  return `${kes.format(value)} ${label}`;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function statusLabel(property: Property): string {
  if (property.status === "sold") return "Sold";
  if (property.status === "rented") return "Rented";
  if (property.status === "reserved") return "Reserved";
  if (property.status === "pending") return "Pending";
  if (property.status === "unavailable") return "Unavailable";
  return property.listingType === "rent" ? "For Rent" : "For Sale";
}


export function propertyLocation(property: Property): string {
  return [property.area, property.town].filter(Boolean).join(", ");
}

export function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Kenyan mobile formats: 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, 2541XXXXXXXX */
export function isValidKenyanPhone(value: string): boolean {
  const cleaned = value.replace(/[\s-]/g, "");
  return /^(?:\+?254|0)(?:7|1)\d{8}$/.test(cleaned);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
