import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useArticles } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import {
  seo,
  articleSeoTitle,
  articleSeoDescription,
  articleLd,
  breadcrumbLd,
  jsonLd,
  organizationLd,
} from "@/lib/seo";

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => {
    const label = params.slug.replace(/-/g, " ");
    const base = seo({
      title: `${label} | Property Masters`,
      description: "A practical Property Masters guide to buying, renting or owning property in Kenya.",
      path: `/insights/${params.slug}`,
      type: "article",
    });
    return {
      meta: base.meta,
      links: base.links,
      scripts: [jsonLd(organizationLd())],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: articles = [], isLoading } = useArticles();
  const article = articles.find((a) => a.slug === slug && a.published);

  if (!article) {
    if (isLoading) {
      return (
        <div className="container-page py-14">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-40 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      );
    }
    throw notFound();
  }

  const pageTitle = articleSeoTitle(article);
  const pageDescription = articleSeoDescription(article);
  const crumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: article.title, path: `/insights/${article.slug}` },
  ]);

  return (
    <article className="container-page py-14 lg:py-20">
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:type" content="article" />
      <script type="application/ld+json">{JSON.stringify(articleLd(article))}</script>
      <script type="application/ld+json">{JSON.stringify(crumbs)}</script>

      <div className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/insights" className="hover:text-foreground">
                Insights
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{article.title}</li>
          </ol>
        </nav>
        <p className="eyebrow">
          {article.category} · {formatDate(article.publishedAt)}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="mt-10 space-y-5">
          {article.body.split("\n\n").map((p) => (
            <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>
        {article.tags?.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <li
                key={t}
                className="rounded-sm border border-border px-2.5 py-1 text-xs text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          Written by {article.author}. General guidance only — confirm specifics with your advocate.
        </p>
        <p className="mt-4 text-sm">
          <Link to="/contact" className="font-medium text-bronze hover:underline">
            Speak to Property Masters about a viewing or listing →
          </Link>
        </p>
      </div>
    </article>
  );
}
