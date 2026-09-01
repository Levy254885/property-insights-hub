import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PropertyGrid } from "./PropertyGrid";
import { PropertyCardSkeleton } from "./PropertyCard";
import { EmptyState } from "@/components/site/EmptyState";
import { applyFilters, defaultFilters, useLocations, useProperties, usePropertyTypes } from "@/lib/queries";

import { formatPrice, propertyLocation, statusLabel } from "@/lib/format";
import type { PropertyFiltersState } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

function FilterFields({
  filters,
  set,
  lock,
}: {
  filters: PropertyFiltersState;
  set: (patch: Partial<PropertyFiltersState>) => void;
  lock: { listing?: boolean; category?: boolean };
}) {
  const { data: types } = usePropertyTypes();
  const { data: locations } = useLocations();
  const relevantTypes = types.filter((t) =>
    filters.category === "all" ? true : t.category === filters.category,
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="eyebrow mb-1.5 block" htmlFor="f-q">
          Keyword
        </label>
        <Input
          id="f-q"
          value={filters.q}
          placeholder="Title, area or description"
          onChange={(e) => set({ q: e.target.value })}
        />
      </div>

      {!lock.listing && (
        <div>
          <span className="eyebrow mb-1.5 block">Listing</span>
          <div className="flex gap-2">
            {(["all", "sale", "rent"] as const).map((v) => (
              <Button
                key={v}
                type="button"
                size="sm"
                variant={filters.listingType === v ? "default" : "outline"}
                onClick={() => set({ listingType: v })}
              >
                {v === "all" ? "All" : v === "sale" ? "For sale" : "To rent"}
              </Button>
            ))}
          </div>
        </div>
      )}

      {!lock.category && (
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="f-cat">
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(v) => set({ category: v as PropertyFiltersState["category"], typeId: "" })}
          >
            <SelectTrigger id="f-cat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="eyebrow mb-1.5 block" htmlFor="f-type">
          Property type
        </label>
        <Select value={filters.typeId || "any"} onValueChange={(v) => set({ typeId: v === "any" ? "" : v })}>
          <SelectTrigger id="f-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any type</SelectItem>
            {relevantTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="eyebrow mb-1.5 block" htmlFor="f-area">
          Location
        </label>
        <Select
          value={filters.areaSlug || "any"}
          onValueChange={(v) => set({ areaSlug: v === "any" ? "" : v })}
        >
          <SelectTrigger id="f-area">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any location</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l.id} value={l.slug}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="f-min">
            Min price
          </label>
          <Input
            id="f-min"
            inputMode="numeric"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="f-max">
            Max price
          </label>
          <Input
            id="f-max"
            inputMode="numeric"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="f-beds">
            Beds
          </label>
          <Input
            id="f-beds"
            inputMode="numeric"
            value={filters.bedrooms}
            onChange={(e) => set({ bedrooms: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="f-baths">
            Baths
          </label>
          <Input
            id="f-baths"
            inputMode="numeric"
            value={filters.bathrooms}
            onChange={(e) => set({ bathrooms: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="f-size">
            Min m²
          </label>
          <Input
            id="f-size"
            inputMode="numeric"
            value={filters.minSize}
            onChange={(e) => set({ minSize: e.target.value.replace(/[^0-9]/g, "") })}
          />
        </div>
      </div>

      <fieldset>
        <legend className="eyebrow mb-3">Amenities</legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {amenityOptions.map((a) => {
            const id = `am-${a.replace(/\s/g, "-")}`;
            return (
              <label key={a} htmlFor={id} className="flex items-center gap-2.5 text-sm text-foreground">
                <Checkbox
                  id={id}
                  checked={filters.amenities.includes(a)}
                  onCheckedChange={(checked) =>
                    set({
                      amenities: checked
                        ? [...filters.amenities, a]
                        : filters.amenities.filter((x) => x !== a),
                    })
                  }
                />
                {a}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export function PropertyBrowser({
  initial,
  lock = {},
  heading,
}: {
  initial?: Partial<PropertyFiltersState>;
  lock?: { listing?: boolean; category?: boolean };
  heading?: string;
}) {
  const { data: properties, isFetching } = useProperties();
  const { data: types } = usePropertyTypes();
  const [filters, setFilters] = useState<PropertyFiltersState>({ ...defaultFilters, ...initial });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  const set = (patch: Partial<PropertyFiltersState>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const typeCategory = useMemo(
    () => (id: string) => types.find((t) => t.id === id)?.category,
    [types],
  );
  const results = useMemo(
    () => applyFilters(properties, filters, typeCategory),
    [properties, filters, typeCategory],
  );
  const visible = results.slice(0, page * PAGE_SIZE);
  const activeCount =
    (filters.q ? 1 : 0) +
    (filters.typeId ? 1 : 0) +
    (filters.areaSlug ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.bathrooms ? 1 : 0) +
    (filters.minSize ? 1 : 0) +
    filters.amenities.length;

  const reset = () => set({ ...defaultFilters, ...initial });

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[300px_1fr] lg:py-14">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-foreground">Filters</h2>
            {activeCount > 0 && (
              <Button variant="link" size="sm" className="h-auto p-0" onClick={reset}>
                Clear all
              </Button>
            )}
          </div>
          <FilterFields filters={filters} set={set} lock={lock} />
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              {heading ?? "Properties"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "property" : "properties"} available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={drawer} onOpenChange={setDrawer}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal /> Filters{activeCount ? ` (${activeCount})` : ""}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto">
                <SheetTitle className="mb-6">Filter properties</SheetTitle>
                <FilterFields filters={filters} set={set} lock={lock} />
                <div className="sticky bottom-0 mt-8 flex gap-3 bg-background py-4">
                  <Button variant="outline" className="flex-1" onClick={reset}>
                    <X /> Clear
                  </Button>
                  <Button className="flex-1" onClick={() => setDrawer(false)}>
                    Show {results.length} results
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select
              value={filters.sort}
              onValueChange={(v) => set({ sort: v as PropertyFiltersState["sort"] })}
            >
              <SelectTrigger className="h-8 w-[170px] text-xs" aria-label="Sort properties">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="largest">Largest</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden rounded-md border border-border sm:flex">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={cn("grid h-8 w-8 place-items-center", view === "grid" && "bg-secondary")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn("grid h-8 w-8 place-items-center", view === "list" && "bg-secondary")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8">
          {isFetching && properties.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title="No properties match your search."
              description="Try widening the price range, choosing a different location, or clearing your filters."
              actions={
                <>
                  <Button onClick={reset}>Clear filters</Button>
                  <Button variant="outline" asChild>
                    <Link to="/properties">Browse all properties</Link>
                  </Button>
                </>
              }
            />
          ) : view === "list" ? (
            <ul className="divide-y divide-border border-y border-border">
              {visible.map((p) => (
                <li key={p.id} className="flex flex-col gap-4 py-5 sm:flex-row">
                  <img
                    src={p.primaryImage}
                    alt={p.images[0]?.alt ?? p.title}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="h-40 w-full rounded-md object-cover sm:w-56"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="eyebrow">{statusLabel(p)}</p>
                    <h3 className="mt-1 text-base font-semibold">
                      <Link to="/properties/$slug" params={{ slug: p.slug }} className="hover:text-bronze">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{propertyLocation(p)}</p>
                    <p className="mt-auto pt-3 text-lg font-bold">{formatPrice(p.price, p.listingType)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <PropertyGrid properties={visible} types={types} />
          )}

          {visible.length < results.length && (
            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg" onClick={() => setPage((p) => p + 1)}>
                Load more properties
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
