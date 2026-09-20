import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useArticles } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { seo } from "@/lib/seo";

const head = seo({
  title: "Property Insights & Buying Guides for Kenya | Property Masters",
  description:
    "Practical guides on buying land, renting in Nairobi, reading listings, diaspora investment and due diligence — from Property Masters, Westlands.",
  path: "/insights",
  keywords: [
    "buying property in Kenya",
    "land due diligence Kenya",
    "renting in Nairobi",
    "diaspora property Kenya",
    "title search Kenya",
    "Property Masters guides",
  ],
});

export const Route = createFileRoute("/insights/")({
  head: () => head,
  component: InsightsPage,
});

function InsightsPage() {
  const { data: articles = [] } = useArticles();
  const published = articles.filter((a) => a.published);

  return (
    <div className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Insights"
        title="Guides and market notes"
        description="Practical, sourced guidance for buying, renting and owning property in Kenya. Written for buyers, tenants and diaspora investors."
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
