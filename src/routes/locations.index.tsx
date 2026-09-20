import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLocations, useProperties, isPublic } from "@/lib/queries";
import { seo } from "@/lib/seo";

const head = seo({
  title: "Property Locations across Kenya — Nairobi, Kitengela & More | Property Masters",
  description:
    "Browse property by neighbourhood and town: Westlands, Kilimani, Karen, Runda, Kitengela and more. Live listings from Property Masters, Westlands Nairobi.",
  path: "/locations",
  keywords: [
    "property locations Kenya",
    "property Westlands",
    "property Kilimani",
    "property Karen",
    "land Kitengela",
    "Property Masters Nairobi",
  ],
});

export const Route = createFileRoute("/locations/")({
  head: () => head,
  component: LocationsPage,
});

function LocationsPage() {
  const { data: locations = [] } = useLocations();
  const { data: properties = [] } = useProperties();
  const published = properties.filter(isPublic);

  return (
    <div className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Locations"
        title="Browse property by location"
        description="Each location page lists what is currently available, the property types found there and related areas. Search by neighbourhood the way buyers and tenants actually search."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((l) => {
          const count = published.filter((p) => p.areaSlug === l.slug).length;
          return (
            <li key={l.id}>
              <Link
                to="/locations/$slug"
                params={{ slug: l.slug }}
                className="flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-bronze"
              >
                <p className="text-base font-semibold">{l.name}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{l.intro}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {count} {count === 1 ? "listing" : "listings"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
