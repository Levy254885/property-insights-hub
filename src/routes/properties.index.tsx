import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";
import type { PropertyFiltersState } from "@/lib/types";
import { seo } from "@/lib/seo";

export interface PropertySearchParams {
  q?: string;
  listing?: "sale" | "rent";
  category?: "residential" | "land" | "commercial";
  area?: string;
  type?: string;
  min?: string;
  max?: string;
  beds?: string;
}

const head = seo({
  title: "Property Search — Homes, Land & Commercial in Kenya | Property Masters",
  description:
    "Search homes, apartments, land and commercial property across Kenya. Filter by location, price, bedrooms, size and amenities. Verified inventory from Property Masters, Westlands.",
  path: "/properties",
  keywords: [
    "property search Kenya",
    "homes for sale Nairobi",
    "apartments for rent Nairobi",
    "land for sale Kenya",
    "commercial property Nairobi",
    "Property Masters",
  ],
});

export const Route = createFileRoute("/properties/")({
  validateSearch: (search: Record<string, unknown>): PropertySearchParams => ({
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
    ...(search["listing"] === "sale" || search["listing"] === "rent"
      ? { listing: search["listing"] }
      : {}),
    ...(search["category"] === "residential" ||
    search["category"] === "land" ||
    search["category"] === "commercial"
      ? { category: search["category"] }
      : {}),
    ...(typeof search["area"] === "string" ? { area: search["area"] } : {}),
    ...(typeof search["type"] === "string" ? { type: search["type"] } : {}),
    ...(typeof search["min"] === "string" ? { min: search["min"] } : {}),
    ...(typeof search["max"] === "string" ? { max: search["max"] } : {}),
    ...(typeof search["beds"] === "string" ? { beds: search["beds"] } : {}),
  }),
  head: () => head,
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const initial: Partial<PropertyFiltersState> = {
    q: search.q ?? "",
    listingType: search.listing ?? "all",
    category: search.category ?? "all",
    areaSlug: search.area ?? "",
    typeId: search.type ?? "",
    minPrice: search.min ?? "",
    maxPrice: search.max ?? "",
    bedrooms: search.beds ?? "",
  };
  return <PropertyBrowser initial={initial} heading="Properties" />;
}
