import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
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
import { saveLocation, saveProperty, savePropertyType } from "@/lib/store";
import type { ListingType, Property, PropertyStatus } from "@/lib/types";

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
  const [saving, setSaving] = useState(false);
  const [typeText, setTypeText] = useState("");
  const [areaText, setAreaText] = useState("");
  const hydrated = useRef(Boolean(existing));

  // Inventory loads asynchronously, so adopt the real record as soon as it
  // arrives (the editor otherwise starts from a blank form on a hard reload).
  useEffect(() => {
    if (existing && !hydrated.current) {
      hydrated.current = true;
      setForm(existing);
    }
  }, [existing]);

  const set = <K extends keyof Property>(key: K, value: Property[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const num = (v: string) => (v.trim() === "" ? undefined : Number(v));




  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("A title is required");
      return;
    }
    setSaving(true);
    try {
      // Property type: free text. Reuse a matching record, otherwise create one
      // so filters and category pages pick the new type up automatically.
      const typeLabel = (typeText || types.find((t) => t.id === form.propertyTypeId)?.name || "").trim();
      let propertyTypeId = form.propertyTypeId;
      if (typeLabel) {
        const match = types.find((t) => t.name.toLowerCase() === typeLabel.toLowerCase());
        propertyTypeId = match?.id ?? slugify(typeLabel);
        if (!match) {
          await savePropertyType({
            id: propertyTypeId,
            name: typeLabel,
            slug: slugify(typeLabel),
            category: /land|plot|farm/i.test(typeLabel)
              ? "land"
              : /office|shop|retail|warehouse|commercial|godown/i.test(typeLabel)
                ? "commercial"
                : "residential",
          });
        }
      }

      // Location: free text, "Area, Town" accepted.
      const locLabel = (areaText || form.area || "").trim();
      let { areaSlug, area, town, countyId } = form;
      if (locLabel) {
        const [areaPart, townPart] = locLabel.split(",").map((x) => x.trim());
        const match = locations.find(
          (l) => l.name.toLowerCase() === (areaPart ?? "").toLowerCase() || l.slug === form.areaSlug,
        );
        area = areaPart || locLabel;
        town = townPart || match?.town || area;
        areaSlug = match?.slug ?? slugify(area);
        countyId = match?.countyId ?? countyId ?? "";
        if (!match) {
          await saveLocation({
            id: areaSlug,
            name: area,
            slug: areaSlug,
            countyId: countyId || "kenya",
            town,
            intro: `${area} property listings from Property Masters.`,
          });
        }
      }

      const payload: Property = {
        ...form,
        propertyTypeId,
        slug: form.slug || slugify(form.title),
        area,
        town,
        countyId,
        areaSlug,
        primaryImage: form.primaryImage || (form.images[0]?.url ?? ""),
        isDemo: false,
        updatedAt: new Date().toISOString(),
      };
      await saveProperty(payload);
      await qc.invalidateQueries({ queryKey: ["propertyTypes"] });
      await qc.invalidateQueries({ queryKey: ["locations"] });
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
          <Input
            id="p-type"
            list="pm-types"
            placeholder="e.g. Beach House"
            value={typeText || types.find((t) => t.id === form.propertyTypeId)?.name || ""}
            onChange={(e) => setTypeText(e.target.value)}
          />
          <datalist id="pm-types">
            {types.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
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
          <p className="mt-1.5 text-xs text-muted-foreground">
            {form.status === "draft"
              ? "Drafts are hidden from the public website."
              : "This listing is live on the public website."}
          </p>
        </div>
        <div>
          <label htmlFor="p-area" className="eyebrow mb-1.5 block">
            Location
          </label>
          <Input
            id="p-area"
            list="pm-locations"
            placeholder="e.g. Nyali, Mombasa"
            value={areaText || (form.area ? `${form.area}${form.town && form.town !== form.area ? `, ${form.town}` : ""}` : "")}
            onChange={(e) => setAreaText(e.target.value)}
          />
          <datalist id="pm-locations">
            {locations.map((l) => (
              <option key={l.id} value={`${l.name}, ${l.town}`} />
            ))}
          </datalist>
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
          Upload as many photographs as the listing needs — they are stored on the Cloudinary CDN, not in the database, so they appear for every visitor instantly. Reorder them and pick the cover image used on cards and previews.
        </p>
        <div className="mt-4">
          <ImageUploader
            propertyId={form.id}
            images={form.images}
            primaryImage={form.primaryImage}
            altBase={form.title || "Property Masters property photograph"}
            onChange={(images, primaryImage) => setForm((f) => ({ ...f, images, primaryImage }))}
          />
        </div>
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
