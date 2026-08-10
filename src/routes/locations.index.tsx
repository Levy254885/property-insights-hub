import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLocations, useProperties, isPublic } from "@/lib/queries";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "Property locations across Kenya | Property Masters" },
      { name: "description", content: "Browse property by county, town and neighbourhood across Kenya." },
      { property: "og:title", content: "Property locations across Kenya | Property Masters" },
      { property: "og:description", content: "Explore the Kenyan markets Property Masters covers." },
      { property: "og:url", content: "/locations" },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  const { data: locations } = useLocations();
  const { data: properties } = useProperties();
  const published = properties.filter(isPublic);

  return (
    <div className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Locations"
        title="Browse property by location"
        description="Each location page lists what is currently available, the property types found there and related areas."
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
