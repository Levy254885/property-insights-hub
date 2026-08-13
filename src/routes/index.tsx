import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, MessagesSquare, ScrollText } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";
import { Button } from "@/components/ui/button";
import { PropertySearch } from "@/components/property/PropertySearch";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useArticles, useLocations, useProperties, usePropertyTypes, isPublic } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { defaultSettings } from "@/lib/settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Property Masters | Homes, land and commercial property in Kenya" },
      {
        name: "description",
        content:
          "Discover carefully selected homes, land and commercial properties across Kenya. Search by location, type and price with Property Masters.",
      },
      { property: "og:title", content: "Property Masters | Property, handled properly." },
      {
        property: "og:description",
        content: "Homes, land and commercial property across Kenya, presented with accurate information.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const categories = [
  { name: "Houses", typeId: "house" },
  { name: "Apartments", typeId: "apartment" },
  { name: "Land", typeId: "residential-land" },
  { name: "Villas", typeId: "villa" },
  { name: "Commercial", typeId: "commercial-building" },
  { name: "Offices", typeId: "office" },
  { name: "Shops", typeId: "shop" },
  { name: "Warehouses", typeId: "warehouse" },
];

const trust = [
  { icon: BadgeCheck, title: "Verified inventory", body: "Every property we market has had its ownership and key details checked by our team before it is published." },
  { icon: MapPin, title: "Local market knowledge", body: "Advice grounded in the specific neighbourhood you are buying or renting in, not generic national averages." },
  { icon: MessagesSquare, title: "Professional assistance", body: "One point of contact from first viewing through to offer, documentation and handover." },
  { icon: ScrollText, title: "Transparent information", body: "Sizes, tenure, service charge and price basis stated clearly on every listing we publish." },
];

function Home() {
  const { data: properties } = useProperties();
  const { data: types } = usePropertyTypes();
  const { data: locations } = useLocations();
  const { data: articles } = useArticles();

  const published = properties.filter(isPublic);
  const featured = published.filter((p) => p.featured).slice(0, 3);
  const latest = [...published].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3);

  return (
    <>
      <section className="relative">
        <div className="relative min-h-[560px] overflow-hidden bg-ink lg:min-h-[660px]">
          <img
            src={heroImage}
            alt="Contemporary Kenyan home at dusk with lit interiors and a mature garden"
            width={1920}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
          <div className="container-page relative flex min-h-[560px] flex-col justify-end pb-44 pt-24 lg:min-h-[660px] lg:pb-52">
            <p className="eyebrow text-ink-foreground/70">Property, handled properly</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] text-ink-foreground sm:text-5xl lg:text-6xl">
              Find property worth moving for.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/80">
              Discover carefully selected homes, land and commercial properties across Kenya.
            </p>
          </div>
        </div>
        <div className="container-page relative -mt-36 pb-4 lg:-mt-40">
          <PropertySearch />
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Selected listings"
          title="Featured properties"
          description="A short list of homes and land currently drawing the most interest."
          action={
            <Button variant="outline" asChild>
              <Link to="/properties">
                View all <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="mt-10">
          <PropertyGrid properties={featured} types={types} />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container-page py-16 lg:py-20">
          <SectionHeading eyebrow="Categories" title="Explore by property type" />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c) => (
              <li key={c.name}>
                <Link
                  to="/properties"
                  search={{ type: c.typeId }}
                  className="flex h-full items-center justify-between rounded-md border border-border bg-card px-5 py-6 text-sm font-semibold transition-colors hover:border-bronze"
                >
                  {c.name}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Where"
          title="Explore by location"
          description="Browse listings by the markets we cover across Kenya."
          action={
            <Button variant="outline" asChild>
              <Link to="/locations">All locations</Link>
            </Button>
          }
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {locations.slice(0, 12).map((l) => {
            const count = published.filter((p) => p.areaSlug === l.slug).length;
            return (
              <li key={l.id}>
                <Link
                  to="/locations/$slug"
                  params={{ slug: l.slug }}
                  className="block rounded-md border border-border bg-card px-5 py-5 transition-colors hover:border-bronze"
                >
                  <p className="text-sm font-semibold">{l.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {count} {count === 1 ? "listing" : "listings"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-y border-border bg-ink text-ink-foreground">
        <div className="container-page py-16 lg:py-24">
          <p className="eyebrow text-ink-foreground/60">Why Property Masters</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold sm:text-3xl">
            A straightforward way to buy and rent property in Kenya.
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <div key={t.title}>
                <t.icon className="h-5 w-5 text-bronze" />
                <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <SectionHeading eyebrow="Just listed" title="Latest properties" />
        <div className="mt-10">
          <PropertyGrid properties={latest} types={types} />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container-page grid gap-8 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Speak to us</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Found something you like? Arrange a viewing.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Every property on this site is marketed directly by Property Masters. Tell us what you
              are looking for and a property specialist will take you through the options.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button size="lg" asChild>
              <Link to="/contact">Talk to a Property Specialist</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`tel:${defaultSettings.phone.replace(/\s/g, "")}`}>Call Property Masters</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Insights"
          title="Guides and market notes"
          action={
            <Button variant="outline" asChild>
              <Link to="/insights">All insights</Link>
            </Button>
          }
        />
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <li key={a.id} className="border-t border-border pt-5">
              <p className="eyebrow">
                {a.category} · {formatDate(a.publishedAt)}
              </p>
              <h3 className="mt-3 text-base font-semibold leading-snug">
                <Link to="/insights/$slug" params={{ slug: a.slug }} className="hover:text-bronze">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-24">
        <div className="flex flex-col items-start gap-6 rounded-md border border-border bg-card px-8 py-14 sm:items-center sm:text-center">
          <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">Let's find the right property.</h2>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/properties">Explore Properties</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Property Masters</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
