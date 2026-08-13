import { createFileRoute } from "@tanstack/react-router";
import { defaultSettings } from "@/lib/settings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const rows: Array<[string, string]> = [
    ["Company", defaultSettings.companyName],
    ["Tagline", defaultSettings.tagline],
    ["Phone", defaultSettings.phone],
    ["WhatsApp", defaultSettings.whatsapp],
    ["Email", defaultSettings.email],
    ["Address", defaultSettings.address],
    ["Business hours", defaultSettings.businessHours],
    ["Default SEO title", defaultSettings.defaultSeoTitle],
    ["Default SEO description", defaultSettings.defaultSeoDescription],
  ];

  return (
    <div>
      <h2 className="text-lg font-bold">Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Company details used across the public site, enquiry replies and structured data.
      </p>
      <dl className="mt-6 divide-y divide-border rounded-md border border-border bg-card">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 p-4 sm:grid-cols-3">
            <dt className="eyebrow">{label}</dt>
            <dd className="text-sm sm:col-span-2">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
