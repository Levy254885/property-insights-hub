import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { useProperties } from "@/lib/queries";
import { deleteProperty, patchProperty } from "@/lib/store";
import type { PropertyStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/properties/")({
  component: AdminProperties,
});

const statuses: Array<{ value: PropertyStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "unavailable", label: "Unavailable" },
  { value: "draft", label: "Draft" },
];

function AdminProperties() {
  const { data: properties } = useProperties();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PropertyStatus | "all">("all");

  const rows = properties
    .filter((p) => (status === "all" ? true : p.status === status))
    .filter((p) => (q ? `${p.title} ${p.area} ${p.town}`.toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  async function mutate(id: string, patch: Parameters<typeof patchProperty>[1], message: string) {
    try {
      await patchProperty(id, patch);
      await qc.invalidateQueries({ queryKey: ["properties"] });
      toast.success(message);
    } catch (error) {
      toast.error("Could not update property", { description: (error as Error).message });
    }
  }

  async function remove(property: (typeof rows)[number]) {
    if (property.isDemo) {
      toast.message("Demo records can't be deleted", {
        description: "They are placeholders and disappear automatically once you add real inventory.",
      });
      return;
    }
    if (!window.confirm(`Delete "${property.title}" and its photographs from the inventory?`)) return;
    try {
      await deleteProperty(property.id, property.images);
      await qc.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property deleted");
    } catch (error) {
      toast.error("Could not delete property", { description: (error as Error).message });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Properties</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The Property Masters inventory. Only staff can create or edit these records.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/properties/$id" params={{ id: "new" }}>
            Add property
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search inventory"
          className="max-w-xs"
          aria-label="Search inventory"
        />
        <Select value={status} onValueChange={(v) => setStatus(v as PropertyStatus | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="mt-6 divide-y divide-border rounded-md border border-border bg-card">
        {rows.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.area}, {p.town} · {formatPrice(p.price, p.listingType)} · {p.status}
                {p.featured ? " · featured" : ""}
                {p.isDemo ? " · demo record" : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/properties/$id" params={{ id: p.id }}>
                  Edit
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  void mutate(p.id, { featured: !p.featured }, p.featured ? "Removed from featured" : "Marked as featured")
                }
              >
                {p.featured ? "Unfeature" : "Feature"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  void mutate(
                    p.id,
                    { verified: !p.verified },
                    p.verified ? "Verification removed" : "Marked as verified",
                  )
                }
              >
                {p.verified ? "Unverify" : "Verify"}
              </Button>
              <Select
                value={p.status}
                onValueChange={(v) =>
                  void mutate(p.id, { status: v as PropertyStatus }, "Status updated")
                }
              >
                <SelectTrigger className="h-9 w-[9.5rem]" aria-label={`Status for ${p.title}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses
                    .filter((s) => s.value !== "all")
                    .map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => void remove(p.id, p.title)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="p-6 text-sm text-muted-foreground">No properties match this filter.</li>
        )}
      </ul>
    </div>
  );
}
