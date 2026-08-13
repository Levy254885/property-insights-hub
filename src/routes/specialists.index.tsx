import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useSpecialists } from "@/lib/queries";

export const Route = createFileRoute("/specialists/")({
  head: () => ({
    meta: [
      { title: "Property specialists | Property Masters" },
      {
        name: "description",
        content:
          "Speak with the Property Masters specialists handling our sales, lettings, land and commercial property.",
      },
      { property: "og:title", content: "Property specialists | Property Masters" },
      {
        property: "og:description",
        content: "The in-house team behind every Property Masters sale and letting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/specialists" },
    ],
    links: [{ rel: "canonical", href: "/specialists" }],
  }),
  component: SpecialistsPage,
});

function SpecialistsPage() {
  const { data: specialists } = useSpecialists();
  return (
    <div className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Our team"
        title="Speak with a property specialist"
        description="Our in-house specialists handle every Property Masters property from first viewing through to handover."
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {specialists
          .filter((a) => a.active)
          .map((a) => (
            <li key={a.id} className="rounded-md border border-border bg-card p-6">
              <p className="text-base font-semibold">{a.name}</p>
              <p className="text-sm text-bronze">{a.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.bio}</p>
              <Link
                to="/specialists/$slug"
                params={{ slug: a.slug }}
                className="mt-5 inline-block text-sm font-semibold underline underline-offset-4"
              >
                View properties
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
