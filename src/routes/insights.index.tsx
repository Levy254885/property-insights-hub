import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useArticles } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Property insights and guides | Property Masters" },
      { name: "description", content: "Buying guides, land due diligence and rental market notes for Kenya." },
      { property: "og:title", content: "Property insights and guides | Property Masters" },
      { property: "og:description", content: "Practical guides for buyers, tenants and property owners in Kenya." },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const { data: articles } = useArticles();
  const published = articles.filter((a) => a.published);

  return (
    <div className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Insights"
        title="Guides and market notes"
        description="Practical, sourced guidance for buying, renting and owning property in Kenya."
      />
      <ul className="mt-12 divide-y divide-border border-y border-border">
        {published.map((a) => (
          <li key={a.id} className="py-8">
            <p className="eyebrow">
              {a.category} · {formatDate(a.publishedAt)}
            </p>
            <h2 className="mt-3 text-xl font-bold">
              <Link to="/insights/$slug" params={{ slug: a.slug }} className="hover:text-bronze">
                {a.title}
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
