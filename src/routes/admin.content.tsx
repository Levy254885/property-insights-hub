import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDate } from "@/lib/format";
import { useArticles, useLocations, usePropertyTypes, useSpecialists } from "@/lib/queries";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

function AdminContent() {
  const { data: articles } = useArticles();
  const { data: specialists } = useSpecialists();
  const { data: locations } = useLocations();
  const { data: types } = usePropertyTypes();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-bold">Content</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Insights, specialists, locations and property types published on the public site.
        </p>
      </div>

      <section>
        <h3 className="text-base font-semibold">Insights</h3>
        <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-card">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.category} · {formatDate(a.publishedAt)} · {a.published ? "published" : "draft"}
                </p>
              </div>
              <Link
                to="/insights/$slug"
                params={{ slug: a.slug }}
                className="text-sm font-semibold underline underline-offset-4"
              >
                View
              </Link>
            </li>
          ))}
          {articles.length === 0 && <li className="p-6 text-sm text-muted-foreground">No articles yet.</li>}
        </ul>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div>
          <h3 className="text-base font-semibold">Property specialists</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {specialists.map((s) => (
              <li key={s.id}>
                {s.name} — {s.role}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold">Locations</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {locations.map((l) => (
              <li key={l.id}>
                {l.name}, {l.town}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold">Property types</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {types.map((t) => (
              <li key={t.id}>
                {t.name} — {t.category}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
