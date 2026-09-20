import { useQuery } from "@tanstack/react-query";
import {
  agents as seedAgents,
  demoArticles,
  locations as seedLocations,
  propertyTypes as seedTypes,
} from "@/data/seed";
import {
  fetchArticles,
  fetchEnquiries,
  fetchLocations,
  fetchProperties,
  fetchPropertyTypes,
  fetchSpecialists,
  fetchUsers,
  fetchViewingRequests,
} from "./store";
import type { Property, PropertyFiltersState } from "./types";

export const defaultFilters: PropertyFiltersState = {
  q: "",
  listingType: "all",
  category: "all",
  typeId: "",
  areaSlug: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  minSize: "",
  amenities: [],
  sort: "newest",
};

/**
 * Live catalogue only. No demo/seed initialData so visitors never see
 * placeholder listings flash before real inventory arrives from Firestore.
 */
export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    staleTime: 60_000,
  });
}

export function usePropertyTypes() {
  return useQuery({
    queryKey: ["propertyTypes"],
    queryFn: fetchPropertyTypes,
    initialData: seedTypes,
    initialDataUpdatedAt: 0,
    staleTime: 300_000,
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    initialData: seedLocations,
    initialDataUpdatedAt: 0,
    staleTime: 300_000,
  });
}

export function useSpecialists() {
  return useQuery({
    queryKey: ["propertySpecialists"],
    queryFn: fetchSpecialists,
    initialData: seedAgents,
    initialDataUpdatedAt: 0,
    staleTime: 300_000,
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    // Keep seed articles only as a soft fallback for first paint of insights;
    // live articles from Firestore take over as soon as they load.
    initialData: demoArticles,
    initialDataUpdatedAt: 0,
    staleTime: 300_000,
  });
}

export function useEnquiries() {
  return useQuery({ queryKey: ["enquiries"], queryFn: fetchEnquiries, initialData: [] });
}

export function useViewingRequests() {
  return useQuery({ queryKey: ["viewingRequests"], queryFn: fetchViewingRequests, initialData: [] });
}

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers, initialData: [] });
}

/** Statuses that are visible on the public catalogue. */
export function isPublic(p: Property): boolean {
  return p.status !== "draft" && !p.isDemo;
}

/** Inventory a customer can still transact on. */
export function isAvailable(p: Property): boolean {
  return p.status === "available" || p.status === "reserved";
}

const num = (v: string): number | null => {
  const n = Number(v);
  return v.trim() === "" || Number.isNaN(n) ? null : n;
};

export function applyFilters(
  properties: Property[],
  filters: PropertyFiltersState,
  typeCategory: (typeId: string) => string | undefined,
  typeName?: (typeId: string) => string | undefined,
): Property[] {
  const q = filters.q.trim().toLowerCase();
  const minPrice = num(filters.minPrice);
  const maxPrice = num(filters.maxPrice);
  const beds = num(filters.bedrooms);
  const baths = num(filters.bathrooms);
  const minSize = num(filters.minSize);

  const result = properties.filter((p) => {
    if (!isPublic(p)) return false;
    if (q) {
      const haystack = [
        p.title,
        p.area,
        p.town,
        p.description,
        p.address ?? "",
        typeName?.(p.propertyTypeId) ?? "",
        p.listingType === "rent" ? "for rent rental" : "for sale buy",
        p.amenities.join(" "),
        p.features.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, " ");
      if (!q.split(/\s+/).every((term) => haystack.includes(term))) return false;
    }
    if (filters.listingType !== "all" && p.listingType !== filters.listingType) return false;
    if (filters.category !== "all" && typeCategory(p.propertyTypeId) !== filters.category) return false;
    if (filters.typeId && p.propertyTypeId !== filters.typeId) return false;
    if (filters.areaSlug && p.areaSlug !== filters.areaSlug) return false;
    if (minPrice !== null && p.price < minPrice) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;
    if (beds !== null && (p.bedrooms ?? 0) < beds) return false;
    if (baths !== null && (p.bathrooms ?? 0) < baths) return false;
    if (minSize !== null && (p.propertySize ?? 0) < minSize) return false;
    if (filters.amenities.length && !filters.amenities.every((a) => p.amenities.includes(a))) return false;
    return true;
  });

  const sorted = [...result];
  switch (filters.sort) {
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "featured":
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    case "largest":
      sorted.sort((a, b) => (b.propertySize ?? 0) - (a.propertySize ?? 0));
      break;
    default:
      sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  return sorted;
}
