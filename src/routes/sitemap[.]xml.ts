import { createFileRoute } from "@tanstack/react-router";
import { locations as seedLocations, demoArticles } from "@/data/seed";
import { companyContact } from "@/lib/settings";
import { fetchProperties, fetchArticles, fetchLocations } from "@/lib/store";
import { isIndexableProperty } from "@/lib/seo";

const staticPaths = [
  "/",
  "/properties",
  "/buy",
  "/rent",
  "/land",
  "/commercial",
  "/locations",
  "/specialists",
  "/insights",
  "/about",
  "/contact",
];

function urlEntry(loc: string, priority: string, lastmod?: string) {
  return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}<priority>${priority}</priority></url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin || companyContact.websiteUrl;

        // Prefer live data so the sitemap tracks real inventory.
        const [properties, articles, locations] = await Promise.all([
          fetchProperties().catch(() => []),
          fetchArticles().catch(() => demoArticles),
          fetchLocations().catch(() => seedLocations),
        ]);

        const indexable = properties.filter(isIndexableProperty);

        const rows = [
          ...staticPaths.map((p) => urlEntry(`${origin}${p}`, p === "/" ? "1.0" : "0.8")),
          ...indexable.map((p) =>
            urlEntry(`${origin}/properties/${p.slug}`, "0.9", p.updatedAt ?? p.publishedAt ?? p.createdAt),
          ),
          ...locations.map((l) => urlEntry(`${origin}/locations/${l.slug}`, "0.6")),
          ...articles
            .filter((a) => a.published)
            .map((a) => urlEntry(`${origin}/insights/${a.slug}`, "0.5", a.updatedAt ?? a.publishedAt)),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
