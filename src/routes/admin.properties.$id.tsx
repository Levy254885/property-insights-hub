import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/format";
import { useLocations, useProperties, usePropertyTypes, useSpecialists } from "@/lib/queries";
import { saveProperty } from "@/lib/store";
import type { ListingType, Property, PropertyImage, PropertyStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/properties/$id")({
  component: PropertyEditor,
});

const statusOptions: Array<{ value: PropertyStatus; label: string }> = [
  { value: "draft", label: "Draft (hidden)" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "unavailable", label: "Unavailable" },
];

function emptyProperty(): Property {
  const iso = new Date().toISOString();
  return {
    id: `pm-${Date.now()}`,
    title: "",
    slug: "",
    description: "",
    listingType: "sale",
    propertyTypeId: "",
    price: 0,
    currency: "KES",
    countyId: "",
    town: "",
    area: "",
    areaSlug: "",
    sizeUnit: "sqm",
    amenities: [],
    features: [],
    images: [],
    primaryImage: "",
    status: "draft",
    featured: false,
    verified: false,
    createdAt: iso,
    updatedAt: iso,
  };
}

function PropertyEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: properties } = useProperties();
  const { data: types } = usePropertyTypes();
  const { data: locations } = useLocations();
  const { data: specialists } = useSpecialists();

  const existing = useMemo(() => properties.find((p) => p.id === id), [properties, id]);
  const [form, setForm] = useState<Property>(() => existing ?? emptyProperty());
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Property>(key: K, value: Property[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const num = (v: string) => (v.trim() === "" ? undefined : Number(v));

  function moveImage(index: number, delta: number) {
    const next = [...form.images];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    const b = next[target]!;
    next[index] = b;
    next[target] = a;
    set("images", next);
  }

  function addImage() {
    const url = imageUrl.trim();
    if (!url) return;
    const image: PropertyImage = { url, alt: form.title || "Property Masters property photograph" };
    const next = [...form.images, image];
    setForm((f) => ({ ...f, images: next, primaryImage: f.primaryImage || url }));
    setImageUrl("");
  }

  function removeImage(index: number) {
    const next = form.images.filter((_, i) => i !== index);
    setForm((f) => ({
      ...f,
      images: next,
      primaryImage: next.some((i) => i.url === f.primaryImage) ? f.primaryImage : (next[0]?.url ?? ""),
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.propertyTypeId || !form.area) {
      toast.error("Title, property type and location are required");
      return;
    }
    setSaving(true);
    try {
      const area = locations.find((l) => l.slug === form.areaSlug);
      const payload: Property = {
        ...form,
        slug: form.slug || slugify(form.title),
        area: area?.name ?? form.area,
        town: area?.town ?? form.town,
        countyId: area?.countyId ?? form.countyId,
        primaryImage: form.primaryImage || (form.images[0]?.url ?? ""),
        isDemo: false,
        updatedAt: new Date().toISOString(),
      };
      await saveProperty(payload);
      await qc.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property saved");
      void navigate({ to: "/admin/properties" });
    } catch (error) {
      toast.error("Could not save property", { description: (error as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{existing ? "Edit property" : "Add property"}</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/properties">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save property"}
          </Button>
        </div>
      </div>

      <section className="grid gap-4 rounded-md border border-border bg-card p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="p-title" className="eyebrow mb-1.5 block">
            Title
          </label>
          <Input id="p-title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="p-desc" className="eyebrow mb-1.5 block">
            Description
          </label>
          <Textarea
            id="p-desc"
            rows={6}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="p-listing" className="eyebrow mb-1.5 block">
            Listing type
          </label>
          <Select value={form.listingType} onValueChange={(v) => set("listingType", v as ListingType)}>
            <SelectTrigger id="p-listing">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For sale</SelectItem>
              <SelectItem value="rent">For rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="p-type" className="eyebrow mb-1.5 block">
            Property type
          </label>
          <Select value={form.propertyTypeId} onValueChange={(v) => set("propertyTypeId", v)}>
            <SelectTrigger id="p-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="p-price" className="eyebrow mb-1.5 block">
            Price (KES)
          </label>
          <Input
            id="p-price"
            type="number"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-status" className="eyebrow mb-1.5 block">
            Availability
          </label>
          <Select value={form.status} onValueChange={(v) => set("status", v as PropertyStatus)}>
            <SelectTrigger id="p-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="p-area" className="eyebrow mb-1.5 block">
            Location
          </label>
          <Select
            value={form.areaSlug}
            onValueChange={(v) => {
              const loc = locations.find((l) => l.slug === v);
              setForm((f) => ({
                ...f,
                areaSlug: v,
                area: loc?.name ?? f.area,
                town: loc?.town ?? f.town,
                countyId: loc?.countyId ?? f.countyId,
              }));
            }}
          >
            <SelectTrigger id="p-area">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l.id} value={l.slug}>
                  {l.name}, {l.town}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="p-specialist" className="eyebrow mb-1.5 block">
            Assigned specialist
          </label>
          <Select value={form.agentId ?? ""} onValueChange={(v) => set("agentId", v)}>
            <SelectTrigger id="p-specialist">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              {specialists.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="grid gap-4 rounded-md border border-border bg-card p-6 sm:grid-cols-3">
        <div>
          <label htmlFor="p-beds" className="eyebrow mb-1.5 block">
            Bedrooms
          </label>
          <Input
            id="p-beds"
            type="number"
            value={form.bedrooms ?? ""}
            onChange={(e) => set("bedrooms", num(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-baths" className="eyebrow mb-1.5 block">
            Bathrooms
          </label>
          <Input
            id="p-baths"
            type="number"
            value={form.bathrooms ?? ""}
            onChange={(e) => set("bathrooms", num(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-park" className="eyebrow mb-1.5 block">
            Parking
          </label>
          <Input
            id="p-park"
            type="number"
            value={form.parkingSpaces ?? ""}
            onChange={(e) => set("parkingSpaces", num(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-size" className="eyebrow mb-1.5 block">
            Property size
          </label>
          <Input
            id="p-size"
            type="number"
            value={form.propertySize ?? ""}
            onChange={(e) => set("propertySize", num(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-land" className="eyebrow mb-1.5 block">
            Land size
          </label>
          <Input
            id="p-land"
            type="number"
            value={form.landSize ?? ""}
            onChange={(e) => set("landSize", num(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-unit" className="eyebrow mb-1.5 block">
            Size unit
          </label>
          <Select value={form.sizeUnit} onValueChange={(v) => set("sizeUnit", v as Property["sizeUnit"])}>
            <SelectTrigger id="p-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqm">Square metres</SelectItem>
              <SelectItem value="sqft">Square feet</SelectItem>
              <SelectItem value="acres">Acres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="p-amenities" className="eyebrow mb-1.5 block">
            Amenities (comma separated)
          </label>
          <Input
            id="p-amenities"
            value={form.amenities.join(", ")}
            onChange={(e) =>
              set("amenities", e.target.value.split(",").map((a) => a.trim()).filter(Boolean))
            }
          />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="p-features" className="eyebrow mb-1.5 block">
            Features (comma separated)
          </label>
          <Input
            id="p-features"
            value={form.features.join(", ")}
            onChange={(e) =>
              set("features", e.target.value.split(",").map((a) => a.trim()).filter(Boolean))
            }
          />
        </div>
      </section>

      <section className="rounded-md border border-border bg-card p-6">
        <h3 className="text-base font-semibold">Photographs</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add image URLs, reorder them, and set the primary image used on cards and previews.
        </p>
        <div className="mt-4 flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            aria-label="Image URL"
          />
          <Button type="button" variant="outline" onClick={addImage}>
            Add
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {form.images.map((img, i) => (
            <li key={img.url} className="flex items-center gap-3 rounded-sm border border-border p-2">
              <img src={img.url} alt="" className="h-14 w-20 rounded-sm object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{img.url}</span>
              {form.primaryImage === img.url && <span className="eyebrow text-bronze">Primary</span>}
              <Button type="button" variant="ghost" size="icon" aria-label="Set primary" onClick={() => set("primaryImage", img.url)}>
                <Star />
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Move up" onClick={() => moveImage(i, -1)}>
                <ArrowUp />
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Move down" onClick={() => moveImage(i, 1)}>
                <ArrowDown />
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Remove image" onClick={() => removeImage(i)}>
                <Trash2 />
              </Button>
            </li>
          ))}
          {form.images.length === 0 && <li className="text-sm text-muted-foreground">No images yet.</li>}
        </ul>
      </section>

      <section className="grid gap-4 rounded-md border border-border bg-card p-6 sm:grid-cols-2">
        <div className="sm:col-span-2 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured property
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => set("verified", e.target.checked)}
            />
            Details verified
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.negotiable ?? false}
              onChange={(e) => set("negotiable", e.target.checked)}
            />
            Price negotiable
          </label>
        </div>
        <div>
          <label htmlFor="p-seo-title" className="eyebrow mb-1.5 block">
            SEO title
          </label>
          <Input
            id="p-seo-title"
            value={form.seoTitle ?? ""}
            onChange={(e) => set("seoTitle", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="p-slug" className="eyebrow mb-1.5 block">
            URL slug
          </label>
          <Input id="p-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="p-seo-desc" className="eyebrow mb-1.5 block">
            SEO description
          </label>
          <Textarea
            id="p-seo-desc"
            rows={3}
            value={form.seoDescription ?? ""}
            onChange={(e) => set("seoDescription", e.target.value)}
          />
        </div>
      </section>
    </form>
  );
}
