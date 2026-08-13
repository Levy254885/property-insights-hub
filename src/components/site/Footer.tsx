import { Link } from "@tanstack/react-router";
import { defaultSettings } from "@/lib/settings";

const columns = [
  {
    title: "Discover",
    links: [
      { label: "All properties", to: "/properties" },
      { label: "Buy", to: "/buy" },
      { label: "Rent", to: "/rent" },
      { label: "Land", to: "/land" },
      { label: "Commercial", to: "/commercial" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Property specialists", to: "/specialists" },
      { label: "Insights", to: "/insights" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Buyers & tenants",
    links: [
      { label: "Saved properties", to: "/favorites" },
      { label: "Locations", to: "/locations" },
      { label: "Book a viewing", to: "/contact" },
      { label: "Staff sign in", to: "/login" },
    ],
  },
] as const;

export function Footer() {
  const s = defaultSettings;
  return (
    <footer className="mt-24 border-t border-border bg-ink text-ink-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
        <div className="lg:col-span-2">
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold uppercase tracking-[0.2em]">Property</span>
            <span className="text-base font-light uppercase tracking-[0.2em] text-bronze">Masters</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-foreground/70">
            {s.tagline} Homes, land and commercial property across Kenya, presented with accurate
            information and straightforward advice.
          </p>
          <dl className="mt-8 space-y-2 text-sm text-ink-foreground/70">
            <div className="flex gap-2">
              <dt className="sr-only">Phone</dt>
              <dd>
                <a className="hover:text-bronze" href={`tel:${s.phone.replace(/\s/g, "")}`}>
                  {s.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <a className="hover:text-bronze" href={`mailto:${s.email}`}>
                  {s.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Address</dt>
              <dd>{s.address}</dd>
            </div>
          </dl>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow text-ink-foreground/50">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link className="text-sm text-ink-foreground/80 hover:text-bronze" to={l.to}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {s.companyName}. Company details to be confirmed.
          </p>
          <p>{s.businessHours}</p>
        </div>
      </div>
    </footer>
  );
}
