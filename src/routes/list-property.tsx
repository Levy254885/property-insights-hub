import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { amenityOptions } from "@/data/seed";
import { usePropertyTypes } from "@/lib/queries";
import { createSubmission } from "@/lib/store";
import { getFirebaseStorage } from "@/lib/firebase";
import { isValidEmail, isValidKenyanPhone } from "@/lib/format";

export const Route = createFileRoute("/list-property")({
  head: () => ({
    meta: [
      { title: "List your property | Property Masters" },
      { name: "description", content: "Submit your house, apartment, land or commercial property for listing with Property Masters." },
      { property: "og:title", content: "List your property | Property Masters" },
      { property: "og:description", content: "Send us your property details. Every submission is reviewed before publication." },
      { property: "og:url", content: "/list-property" },
    ],
    links: [{ rel: "canonical", href: "/list-property" }],
  }),
  component: ListPropertyPage,
});

const empty = {
  title: "",
  listingType: "sale" as "sale" | "rent",
  propertyTypeId: "house",
  price: "",
  county: "",
  town: "",
  area: "",
  description: "",
  bedrooms: "",
  bathrooms: "",
  parkingSpaces: "",
  propertySize: "",
  landSize: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

async function uploadImages(files: File[]): Promise<string[]> {
  const storage = getFirebaseStorage();
  if (!storage || files.length === 0) return [];
  const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  const urls: string[] = [];
  for (const file of files) {
    const path = `submissions/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const snap = await uploadBytes(ref(storage, path), file);
    urls.push(await getDownloadURL(snap.ref));
  }
  return urls;
}

function ListPropertyPage() {
  const { data: types } = usePropertyTypes();
  const [form, setForm] = useState(empty);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const setField = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.title.trim().length < 6) next["title"] = "Give the property a descriptive title.";
    if (!/^\d+$/.test(form.price) || Number(form.price) <= 0) next["price"] = "Enter a numeric price in KES.";
    if (!form.county.trim()) next["county"] = "County is required.";
    if (!form.town.trim()) next["town"] = "Town is required.";
    if (form.description.trim().length < 30) next["description"] = "Please describe the property (30+ characters).";
    if (form.contactName.trim().length < 2) next["contactName"] = "Contact name is required.";
    if (!isValidKenyanPhone(form.contactPhone)) next["contactPhone"] = "Enter a valid Kenyan number.";
    if (!isValidEmail(form.contactEmail)) next["contactEmail"] = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      let images: string[] = [];
      try {
        images = await uploadImages(files);
      } catch {
        toast.error("Images could not be uploaded", {
          description: "Your submission was still sent — we will request photos by email.",
        });
      }
      await createSubmission({
        title: form.title.trim(),
        listingType: form.listingType,
        propertyTypeId: form.propertyTypeId,
        price: Number(form.price),
        county: form.county.trim(),
        town: form.town.trim(),
        area: form.area.trim(),
        description: form.description.trim(),
        ...(form.bedrooms ? { bedrooms: Number(form.bedrooms) } : {}),
        ...(form.bathrooms ? { bathrooms: Number(form.bathrooms) } : {}),
        ...(form.parkingSpaces ? { parkingSpaces: Number(form.parkingSpaces) } : {}),
        ...(form.propertySize ? { propertySize: Number(form.propertySize) } : {}),
        ...(form.landSize ? { landSize: Number(form.landSize) } : {}),
        amenities,
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        images,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setDone(true);
    } catch {
      toast.error("Submission failed", { description: "Please try again in a moment." });
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-xl rounded-md border border-border bg-card p-10 text-center">
          <h1 className="text-2xl font-bold">Submission received</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your property has been submitted for review. It will only appear on the site once our team has
            checked the details and approved it.
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setForm(empty);
              setAmenities([]);
              setFiles([]);
              setDone(false);
            }}
          >
            Submit another property
          </Button>
        </div>
      </div>
    );
  }

  const text = (k: keyof typeof empty, label: string, req = false, type = "text") => (
    <div>
      <label htmlFor={`lp-${k}`} className="eyebrow mb-1.5 block">
        {label} {req && <span aria-hidden>*</span>}
      </label>
      <Input
        id={`lp-${k}`}
        type={type}
        value={form[k] as string}
        aria-invalid={!!errors[k]}
        onChange={(e) => setField(k, e.target.value)}
      />
      {errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Owners and agents</p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">List your property</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Complete the details below. Submissions are reviewed by our team and published only after
          approval. Fields marked * are required.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="mt-12 max-w-3xl space-y-12">
        <fieldset>
          <legend className="text-lg font-bold">Basic information</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">{text("title", "Property title", true)}</div>
            <div>
              <label htmlFor="lp-listing" className="eyebrow mb-1.5 block">
                Listing type *
              </label>
              <Select value={form.listingType} onValueChange={(v) => setField("listingType", v)}>
                <SelectTrigger id="lp-listing">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For sale</SelectItem>
                  <SelectItem value="rent">To rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="lp-type" className="eyebrow mb-1.5 block">
                Property type *
              </label>
              <Select value={form.propertyTypeId} onValueChange={(v) => setField("propertyTypeId", v)}>
                <SelectTrigger id="lp-type">
                  <SelectValue />
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
            {text("price", "Price (KES)", true)}
            {text("county", "County", true)}
            {text("town", "Town", true)}
            {text("area", "Area / neighbourhood")}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">Property details</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {text("bedrooms", "Bedrooms")}
            {text("bathrooms", "Bathrooms")}
            {text("parkingSpaces", "Parking spaces")}
            {text("propertySize", "Property size (m²)")}
            {text("landSize", "Land size (acres)")}
          </div>
          <div className="mt-6">
            <span className="eyebrow mb-3 block">Amenities</span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {amenityOptions.map((a) => {
                const id = `lp-am-${a.replace(/\s/g, "-")}`;
                return (
                  <label key={a} htmlFor={id} className="flex items-center gap-2.5 text-sm">
                    <Checkbox
                      id={id}
                      checked={amenities.includes(a)}
                      onCheckedChange={(c) =>
                        setAmenities((prev) => (c ? [...prev, a] : prev.filter((x) => x !== a)))
                      }
                    />
                    {a}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="lp-desc" className="eyebrow mb-1.5 block">
              Description *
            </label>
            <Textarea
              id="lp-desc"
              rows={6}
              value={form.description}
              aria-invalid={!!errors["description"]}
              onChange={(e) => setField("description", e.target.value)}
            />
            {errors["description"] && (
              <p className="mt-1 text-xs text-destructive">{errors["description"]}</p>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">Images</legend>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload clear photographs of the property. JPG or PNG.
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            aria-label="Property images"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-4 block w-full rounded-md border border-input bg-background p-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-semibold"
          />
          {files.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">{files.length} image(s) selected</p>
          )}
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">Contact</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {text("contactName", "Name", true)}
            {text("contactPhone", "Phone", true, "tel")}
            {text("contactEmail", "Email", true, "email")}
          </div>
        </fieldset>

        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Submitting…" : "Submit property for review"}
        </Button>
      </form>
    </div>
  );
}
