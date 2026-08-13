import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useSpecialists } from "@/lib/queries";

export const Route = createFileRoute("/specialists/")({
  head: () => ({
    meta: [
      { title: "Our team | Property Masters" },
      { name: "description", content: "The Property Masters desks handling sales, lettings, land and commercial property." },
      { property: "og:title", content: "Our team | Property Masters" },
      { property: "og:description", content: "Meet the desks handling each part of the Kenyan property market." },
      { property: "og:url", content: "/specialists" },
    ],
    links: [{ rel: "canonical", href: "/specialists" }],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const { data: specialists } = useSpecialists();
  return (
    <div className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Team"
        title="Who you'll be dealing with"
        description="Individual consultant profiles are published once their details are confirmed."
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
                View listings
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
