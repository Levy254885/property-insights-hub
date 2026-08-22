import { createFileRoute } from "@tanstack/react-router";
import { demoArticles, demoProperties, locations } from "@/data/seed";
import { companyContact } from "@/lib/settings";

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
      GET: ({ request }) => {
        const origin = new URL(request.url).origin || companyContact.websiteUrl;
        const rows = [
          ...staticPaths.map((p) => urlEntry(`${origin}${p}`, p === "/" ? "1.0" : "0.8")),
          ...demoProperties.map((p) =>
            urlEntry(`${origin}/properties/${p.slug}`, "0.9", p.updatedAt),
          ),
          ...locations.map((l) => urlEntry(`${origin}/locations/${l.slug}`, "0.6")),
          ...demoArticles.map((a) => urlEntry(`${origin}/insights/${a.slug}`, "0.5")),
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
