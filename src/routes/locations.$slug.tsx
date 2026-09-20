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
import {
  seo,
  locationSeoTitle,
  locationSeoDescription,
  locationKeywords,
  breadcrumbLd,
  faqLd,
  jsonLd,
  organizationLd,
} from "@/lib/seo";

export const Route = createFileRoute("/locations/$slug")({
  head: ({ params }) => {
    const label = params.slug.replace(/-/g, " ");
    const base = seo({
      title: `Property for Sale & Rent in ${label} | Property Masters`,
      description: `Homes, land and commercial property currently available in ${label}, Kenya. Browse verified listings with Property Masters, Westlands Nairobi.`,
      path: `/locations/${params.slug}`,
      keywords: [
        `property for sale ${label}`,
        `property for rent ${label}`,
        `apartments ${label}`,
        `houses for sale ${label}`,
        `land for sale ${label}`,
      ],
    });
    return {
      meta: base.meta,
      links: base.links,
      scripts: [jsonLd(organizationLd())],
    };
  },
  component: LocationPage,
});

function LocationPage() {
  const { slug } = Route.useParams();
  const { data: locations = [], isLoading: locLoading } = useLocations();
  const { data: properties = [], isLoading: propsLoading } = useProperties();
  const { data: types = [] } = usePropertyTypes();

  const location = locations.find((l) => l.slug === slug);
  if (!location) {
    if (locLoading) {
      return (
        <div className="container-page py-14">
          <div className="h-10 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-20 w-full animate-pulse rounded bg-muted" />
        </div>
      );
    }
    throw notFound();
  }

  const listings = properties.filter((p) => isPublic(p) && p.areaSlug === slug);
  const typeNames = Array.from(
    new Set(listings.map((p) => types.find((t) => t.id === p.propertyTypeId)?.name).filter(Boolean)),
  ) as string[];
  const prices = listings.map((p) => p.price);
  const related = locations.filter(
    (l) => l.slug !== slug && (l.parentSlug === location.parentSlug || l.parentSlug === location.slug),
  );

  const pageTitle = locationSeoTitle(location);
  const pageDescription = locationSeoDescription(location, listings.length, typeNames);
  const keywords = locationKeywords(location);

  const faqs = [
    {
      question: `How do I arrange a viewing in ${location.name}?`,
      answer: `Open any listing and send an enquiry, or contact Property Masters directly by phone or WhatsApp. We confirm availability with the owner before scheduling a viewing in ${location.name}.`,
    },
    {
      question: "Are the prices shown negotiable?",
      answer:
        "Where a seller has indicated flexibility, the listing is marked negotiable. Otherwise the price shown is the asking price. We will advise on typical negotiation ranges for the area when you enquire.",
    },
    {
      question: "Do you handle documentation and title checks?",
      answer:
        "We coordinate with your advocate through searches, sale agreements and transfer, and provide the documents we hold for the property. Independent title verification via Ardhisasa or the land registry remains essential.",
    },
    {
      question: `What types of property are available in ${location.name}?`,
      answer: typeNames.length
        ? `Current inventory in ${location.name} includes ${typeNames.join(", ").toLowerCase()}. Stock changes regularly — contact us if you need something specific.`
        : `We market homes, land and commercial space in ${location.name} as stock becomes available. Tell us what you need and we will alert you.`,
    },
  ];

  const crumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: location.name, path: `/locations/${location.slug}` },
  ]);

  return (
    <div className="container-page py-14 lg:py-20">
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords.join(", ")} />
      <script type="application/ld+json">{JSON.stringify(crumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(faqLd(faqs))}</script>

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

      <h1 className="text-3xl font-extrabold sm:text-4xl">
        Property for Sale & Rent in {location.name}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{location.intro}</p>
      {location.body &&
        location.body.split("\n\n").map((para) => (
          <p key={para.slice(0, 32)} className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {para}
          </p>
        ))}

      <dl className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-3">
        <div>
          <dt className="eyebrow">Listings</dt>
          <dd className="mt-1 text-lg font-bold">{propsLoading ? "…" : listings.length}</dd>
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
        {propsLoading ? (
          <PropertyGrid properties={[]} types={types} loading />
        ) : listings.length ? (
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
        <h2 className="text-lg font-bold">Frequently asked questions about {location.name}</h2>
        <Accordion type="single" collapsible className="mt-4">
          {faqs.map((f, i) => (
            <AccordionItem key={f.question} value={`q${i + 1}`}>
              <AccordionTrigger>{f.question}</AccordionTrigger>
              <AccordionContent>{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="mt-16 flex flex-wrap gap-3 rounded-md border border-border bg-card p-8">
        <Button asChild>
          <Link to="/contact">Talk to a property specialist about {location.name}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/properties" search={{ area: location.slug }}>
            View properties in {location.name}
          </Link>
        </Button>
      </div>
    </div>
  );
}
