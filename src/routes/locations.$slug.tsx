import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { EmptyState } from "@/components/site/EmptyState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocations, useProperties, usePropertyTypes, isPublic } from "@/lib/queries";
import { formatCompactPrice } from "@/lib/format";

export const Route = createFileRoute("/locations/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Property in ${params.slug.replace(/-/g, " ")} | Property Masters` },
      {
        name: "description",
        content: `Homes, land and commercial property currently available in ${params.slug.replace(/-/g, " ")}, Kenya.`,
      },
      { property: "og:url", content: `/locations/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/locations/${params.slug}` }],
  }),
  component: LocationPage,
});

function LocationPage() {
  const { slug } = Route.useParams();
  const { data: locations } = useLocations();
  const { data: properties } = useProperties();
  const { data: types } = usePropertyTypes();

  const location = locations.find((l) => l.slug === slug);
  if (!location) throw notFound();

  const listings = properties.filter((p) => isPublic(p) && p.areaSlug === slug);
  const typeNames = Array.from(
    new Set(listings.map((p) => types.find((t) => t.id === p.propertyTypeId)?.name).filter(Boolean)),
  ) as string[];
  const prices = listings.map((p) => p.price);
  const related = locations.filter(
    (l) => l.slug !== slug && (l.parentSlug === location.parentSlug || l.parentSlug === location.slug),
  );

  return (
    <div className="container-page py-14 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <ol className="flex gap-2">
          <li>
            <Link to="/locations" className="hover:text-foreground">
              Locations
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{location.name}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-extrabold sm:text-4xl">Property in {location.name}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{location.intro}</p>

      <dl className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-3">
        <div>
          <dt className="eyebrow">Listings</dt>
          <dd className="mt-1 text-lg font-bold">{listings.length}</dd>
        </div>
        <div>
          <dt className="eyebrow">Property types</dt>
          <dd className="mt-1 text-sm">{typeNames.length ? typeNames.join(", ") : "—"}</dd>
        </div>
        <div>
          <dt className="eyebrow">Current price range</dt>
          <dd className="mt-1 text-sm">
            {prices.length
              ? `${formatCompactPrice(Math.min(...prices))} – ${formatCompactPrice(Math.max(...prices))}`
              : "No listings yet"}
          </dd>
        </div>
      </dl>

      <div className="mt-12">
        {listings.length ? (
          <PropertyGrid properties={listings} types={types} />
        ) : (
          <EmptyState
            title={`No listings in ${location.name} right now.`}
            description="Tell us what you are looking for and we will notify you when something suitable comes up."
            actions={
              <>
                <Button asChild>
                  <Link to="/contact">Contact us</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/properties">Browse all properties</Link>
                </Button>
              </>
            }
          />
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-bold">Related areas</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  to="/locations/$slug"
                  params={{ slug: r.slug }}
                  className="inline-flex rounded-md border border-border px-3 py-1.5 text-sm hover:border-bronze"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 max-w-3xl">
        <h2 className="text-lg font-bold">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="q1">
            <AccordionTrigger>How do I arrange a viewing in {location.name}?</AccordionTrigger>
            <AccordionContent>
              Open any listing and send an enquiry, or contact us directly. We confirm availability with the
              owner before scheduling.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Are the prices shown negotiable?</AccordionTrigger>
            <AccordionContent>
              Where a seller has indicated flexibility, the listing is marked negotiable. Otherwise the price
              shown is the asking price.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Do you handle documentation?</AccordionTrigger>
            <AccordionContent>
              We coordinate with your advocate through searches, agreements and transfer, and provide the
              documents we hold for the property.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <div className="mt-16 flex flex-wrap gap-3 rounded-md border border-border bg-card p-8">
        <Button asChild>
          <Link to="/contact">Talk to us about {location.name}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/list-property">List a property here</Link>
        </Button>
      </div>
    </div>
  );
}
