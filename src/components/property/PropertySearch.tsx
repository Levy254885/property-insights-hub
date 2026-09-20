import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocations, usePropertyTypes } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { PropertyCategory } from "@/lib/types";

const tabs = [
  { key: "buy", label: "Buy", listing: "sale", category: "all" },
  { key: "rent", label: "Rent", listing: "rent", category: "all" },
  { key: "land", label: "Land", listing: "sale", category: "land" },
  { key: "commercial", label: "Commercial", listing: "all", category: "commercial" },
] as const;

export function PropertySearch({ variant = "hero" }: { variant?: "hero" | "inline" }) {
  const navigate = useNavigate();
  const { data: types } = usePropertyTypes();
  const { data: locations } = useLocations();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("buy");
  const [area, setArea] = useState("any");
  const [typeId, setTypeId] = useState("any");
  const [maxPrice, setMaxPrice] = useState("any");
  const [beds, setBeds] = useState("any");

  const active = tabs.find((t) => t.key === tab)!;
  const relevantTypes = types.filter((t) =>
    active.category === "all" ? true : t.category === (active.category as PropertyCategory),
  );
  const showBeds = active.category !== "land" && active.category !== "commercial";

  const priceOptions =
    active.listing === "rent"
      ? ["50000", "100000", "200000", "400000", "1000000"]
      : ["5000000", "15000000", "30000000", "60000000", "150000000"];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    void navigate({
      to: "/properties",
      search: {
        ...(active.listing !== "all" ? { listing: active.listing } : {}),
        ...(active.category !== "all" ? { category: active.category } : {}),
        ...(area !== "any" ? { area } : {}),
        ...(typeId !== "any" ? { type: typeId } : {}),
        ...(maxPrice !== "any" ? { max: maxPrice } : {}),
        ...(showBeds && beds !== "any" ? { beds } : {}),
      },
    });
  }

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card text-card-foreground shadow-lift",
        variant === "hero" && "backdrop-blur",
      )}
    >
      <div role="tablist" aria-label="Search type" className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative flex-1 px-3 py-3.5 text-sm font-semibold transition-colors sm:flex-none sm:px-7",
              tab === t.key
                ? "text-card-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-bronze after:content-['']"
                : "text-card-muted hover:text-card-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="search-location">
            Location
          </label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger id="search-location" className="h-11 border-border bg-background text-foreground">
              <SelectValue placeholder="Any location" />
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

        <div>
          <label className="eyebrow mb-1.5 block" htmlFor="search-type">
            Property type
          </label>
          <Select value={typeId} onValueChange={setTypeId}>
            <SelectTrigger id="search-type" className="h-11 border-border bg-background text-foreground">
              <SelectValue placeholder="Any type" />
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
          <label className="eyebrow mb-1.5 block" htmlFor="search-price">
            Max price
          </label>
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger id="search-price" className="h-11 border-border bg-background text-foreground">
              <SelectValue placeholder="No maximum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">No maximum</SelectItem>
              {priceOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  KES {Number(p).toLocaleString("en-KE")}
                  {active.listing === "rent" ? " / month" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={cn(!showBeds && "hidden lg:block lg:invisible")}>
          <label className="eyebrow mb-1.5 block" htmlFor="search-beds">
            Bedrooms
          </label>
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger id="search-beds" className="h-11 border-border bg-background text-foreground">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {["1", "2", "3", "4", "5"].map((b) => (
                <SelectItem key={b} value={b}>
                  {b}+ bedrooms
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" size="lg" className="h-11 w-full lg:w-auto">
            <Search /> Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
}

export { Input };
