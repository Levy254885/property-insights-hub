import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDate, formatPrice } from "@/lib/format";
import { useEnquiries, useProperties, useViewingRequests } from "@/lib/queries";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function AdminOverview() {
  const { data: properties } = useProperties();
  const { data: enquiries } = useEnquiries();
  const { data: viewings } = useViewingRequests();

  const recentLeads = [...enquiries]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-bold">Inventory</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total properties" value={properties.length} />
          <Stat label="Available" value={properties.filter((p) => p.status === "available").length} />
          <Stat label="Featured" value={properties.filter((p) => p.featured).length} />
          <Stat label="Sold / rented" value={properties.filter((p) => p.status === "sold" || p.status === "rented").length} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">Leads</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="New enquiries" value={enquiries.filter((e) => e.status === "new").length} />
          <Stat label="All enquiries" value={enquiries.length} />
          <Stat label="Viewing requests" value={viewings.filter((v) => v.status === "requested").length} />
          <Stat label="Scheduled viewings" value={viewings.filter((v) => v.status === "scheduled").length} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent leads</h2>
          <Link to="/admin/enquiries" className="text-sm font-semibold underline underline-offset-4">
            Manage enquiries
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="mt-4 rounded-md border border-dashed border-border-strong p-6 text-sm text-muted-foreground">
            No enquiries yet. Leads sent from the website appear here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
            {recentLeads.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div>
                  <p className="font-semibold">{e.name}</p>
                  <p className="text-muted-foreground">{e.propertyTitle}</p>
                </div>
                <div className="text-right text-muted-foreground">
                  <p>{e.phone}</p>
                  <p className="text-xs">{formatDate(e.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recently updated properties</h2>
          <Link to="/admin/properties" className="text-sm font-semibold underline underline-offset-4">
            Manage properties
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
          {[...properties]
            .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
            .slice(0, 5)
            .map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-muted-foreground">
                    {p.area}, {p.town} · {p.status}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(p.price, p.listingType)}</p>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
