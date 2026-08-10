import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useArticles } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} | Property Masters` },
      { name: "description", content: "A Property Masters guide to the Kenyan property market." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/insights/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/insights/${params.slug}` }],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: articles } = useArticles();
  const article = articles.find((a) => a.slug === slug && a.published);
  if (!article) throw notFound();

  return (
    <article className="container-page py-14 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link to="/insights" className="hover:text-foreground">
            Insights
          </Link>
        </nav>
        <p className="eyebrow">
          {article.category} · {formatDate(article.publishedAt)}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="mt-10 space-y-5">
          {article.body.split("\n\n").map((p) => (
            <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          Written by {article.author}. General guidance only — confirm specifics with your advocate.
        </p>
      </div>
    </article>
  );
}
