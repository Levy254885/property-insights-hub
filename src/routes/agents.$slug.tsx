import { createFileRoute, notFound } from "@tanstack/react-router";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { EmptyState } from "@/components/site/EmptyState";
import { useAgents, useProperties, usePropertyTypes, isPublic } from "@/lib/queries";

export const Route = createFileRoute("/agents/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} | Property Masters` },
      { name: "description", content: "Current listings handled by this Property Masters desk." },
      { property: "og:url", content: `/agents/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/agents/${params.slug}` }],
  }),
  component: AgentPage,
});

function AgentPage() {
  const { slug } = Route.useParams();
  const { data: agents } = useAgents();
  const { data: properties } = useProperties();
  const { data: types } = usePropertyTypes();

  const agent = agents.find((a) => a.slug === slug);
  if (!agent) throw notFound();
  const listings = properties.filter((p) => isPublic(p) && p.agentId === agent.id);

  return (
    <div className="container-page py-14 lg:py-20">
      <h1 className="text-3xl font-extrabold">{agent.name}</h1>
      <p className="mt-1 text-sm text-bronze">{agent.role}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{agent.bio}</p>
      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
        <div>
          <dt className="eyebrow">Areas served</dt>
          <dd className="mt-1">{agent.areasServed.join(", ")}</dd>
        </div>
        <div>
          <dt className="eyebrow">Specialisations</dt>
          <dd className="mt-1">{agent.specialisations.join(", ")}</dd>
        </div>
        <div>
          <dt className="eyebrow">Contact</dt>
          <dd className="mt-1">
            <a className="underline underline-offset-4" href={`mailto:${agent.email}`}>
              {agent.email}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-12">
        {listings.length ? (
          <PropertyGrid properties={listings} types={types} />
        ) : (
          <EmptyState title="No active listings for this desk right now." />
        )}
      </div>
    </div>
  );
}
