import { createFileRoute } from "@tanstack/react-router";
import { PropertyBrowser } from "@/components/property/PropertyBrowser";
import type { PropertyFiltersState } from "@/lib/types";

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
  head: () => ({
    meta: [
      { title: "Property search — homes, land and commercial | Property Masters" },
      {
        name: "description",
        content:
          "Search homes, apartments, land and commercial property across Kenya. Filter by location, price, bedrooms, size and amenities.",
      },
      { property: "og:title", content: "Property search | Property Masters" },
      { property: "og:description", content: "Filter Kenyan property listings by location, price and type." },
      { property: "og:url", content: "/properties" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
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
