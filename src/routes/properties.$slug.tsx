import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Bath,
  BedDouble,
  Car,
  CheckCircle2,
  Heart,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useSpecialists, useProperties, usePropertyTypes, isPublic } from "@/lib/queries";
import { useFavorites } from "@/lib/favorites";
import { formatPrice, formatSize, propertyLocation, statusLabel, whatsappLink } from "@/lib/format";
import { defaultSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/properties/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Property details | Property Masters" },
      { name: "description", content: "Full details, photographs and enquiry options for this listing." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/properties/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/properties/${params.slug}` }],
  }),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { slug } = Route.useParams();
  const { data: properties, isFetching } = useProperties();
  const { data: types } = usePropertyTypes();
  const { data: specialists } = useSpecialists();
  const { isFavorite, toggleFavorite } = useFavorites();

  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    if (isFetching) {
      return (
        <div className="container-page py-14">
          <div className="aspect-[16/10] animate-pulse rounded-md bg-muted" />
          <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      );
    }
    throw notFound();
  }

  if (!isPublic(property)) throw notFound();

  const type = types.find((t) => t.id === property.propertyTypeId);
  const agent = specialists.find((a) => a.id === property.agentId);
  const saved = isFavorite(property.id);
  const size = formatSize(property.propertySize, property.sizeUnit);
  const land = formatSize(property.landSize, property.landSize && property.landSize < 20 ? "acres" : property.sizeUnit);
  const similar = properties
    .filter((p) => p.id !== property.id && isPublic(p) && p.propertyTypeId === property.propertyTypeId)
    .slice(0, 3);

  const waMessage = `Hello Property Masters, I am interested in the ${property.title} in ${propertyLocation(property)}.`;

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: property!.title, url });
        return;
      } catch {
        /* user dismissed */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  const facts = [
    property.bedrooms ? { icon: BedDouble, label: `${property.bedrooms} bedrooms` } : null,
    property.bathrooms ? { icon: Bath, label: `${property.bathrooms} bathrooms` } : null,
    property.parkingSpaces ? { icon: Car, label: `${property.parkingSpaces} parking` } : null,
    size ? { icon: Maximize, label: size } : null,
  ].filter(Boolean) as Array<{ icon: typeof BedDouble; label: string }>;

  return (
    <article className="container-page py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to="/properties" className="hover:text-foreground">
              Properties
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{property.title}</li>
        </ol>
      </nav>

      <PropertyGallery images={property.images} title={property.title} />

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-secondary px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em]">
              {statusLabel(property)}
            </span>
            {property.verified && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-bronze px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-bronze-foreground">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            )}
            {type && <span className="text-xs text-muted-foreground">{type.name}</span>}
            {property.isDemo && (
              <span className="rounded-sm bg-muted px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Demo listing
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-extrabold sm:text-4xl">{property.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {propertyLocation(property)}
          </p>
          <p className="mt-5 text-2xl font-bold sm:text-3xl">
            {formatPrice(property.price, property.listingType)}
            {property.negotiable && (
              <span className="ml-2 align-middle text-xs font-medium text-muted-foreground">Negotiable</span>
            )}
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-5 text-sm">
            {facts.map((f) => (
              <li key={f.label} className="inline-flex items-center gap-2 text-foreground">
                <f.icon className="h-4 w-4 text-muted-foreground" /> {f.label}
              </li>
            ))}
            {land && (
              <li className="inline-flex items-center gap-2">
                <Maximize className="h-4 w-4 text-muted-foreground" /> Land: {land}
              </li>
            )}
          </ul>

          <section className="mt-10">
            <h2 className="text-lg font-bold">Description</h2>
            {property.description.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </section>

          {property.amenities.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold">Amenities</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {property.amenities.map((a) => (
                  <li key={a} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-bronze" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {property.features.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold">Features</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                {property.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-lg font-bold">Location</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {property.area}, {property.town}. Exact address shared with qualified buyers on request.
            </p>
            <div className="mt-4 grid h-56 place-items-center rounded-md border border-dashed border-border-strong bg-secondary/50 text-sm text-muted-foreground">
              Map view will be added once coordinates are confirmed for this listing.
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-8">
            <h2 className="text-lg font-bold">Enquire about this property</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send your details and we will arrange a viewing.
            </p>
            <div className="mt-6 max-w-2xl">
              <EnquiryForm property={property} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-md border border-border bg-card p-6">
            <p className="eyebrow">Speak to us</p>
            <p className="mt-3 text-base font-semibold">{agent?.name ?? "Property Masters"}</p>
            <p className="text-sm text-muted-foreground">{agent?.role ?? "Sales & Lettings"}</p>
            <div className="mt-6 space-y-3">
              <Button className="w-full" asChild>
                <a href={`tel:${defaultSettings.phone.replace(/\s/g, "")}`}>
                  <Phone /> Call {defaultSettings.phone}
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={whatsappLink(defaultSettings.whatsapp, waMessage)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MessageCircle /> WhatsApp enquiry
                </a>
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => toggleFavorite(property.id)}
                  aria-pressed={saved}
                >
                  <Heart className={cn(saved && "fill-bronze text-bronze")} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => void share()}>
                  <Share2 /> Share
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="text-xl font-bold">Similar properties</h2>
          <div className="mt-8">
            <PropertyGrid properties={similar} types={types} />
          </div>
        </section>
      )}
    </article>
  );
}
