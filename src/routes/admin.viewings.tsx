import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { useViewingRequests } from "@/lib/queries";
import { updateViewingStatus } from "@/lib/store";
import type { ViewingStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/viewings")({
  component: AdminViewings,
});

const statuses: Array<{ value: ViewingStatus; label: string }> = [
  { value: "requested", label: "Requested" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function AdminViewings() {
  const { data: viewings } = useViewingRequests();
  const qc = useQueryClient();

  async function setStatus(id: string, status: ViewingStatus) {
    try {
      await updateViewingStatus(id, status);
      await qc.invalidateQueries({ queryKey: ["viewingRequests"] });
      toast.success("Viewing updated");
    } catch (error) {
      toast.error("Could not update viewing", { description: (error as Error).message });
    }
  }

  const sorted = [...viewings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div>
      <h2 className="text-lg font-bold">Viewing requests</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Site visits requested by prospective buyers and tenants.
      </p>

      {sorted.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-border-strong p-6 text-sm text-muted-foreground">
          No viewing requests yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {sorted.map((v) => (
            <li key={v.id} className="rounded-md border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold">{v.name}</p>
                  <p className="text-sm text-muted-foreground">{v.propertyTitle}</p>
                  <p className="mt-2 text-sm">
                    Preferred: <strong>{v.preferredDate}</strong> at <strong>{v.preferredTime}</strong>
                  </p>
                  <p className="mt-1 text-sm">
                    <a className="underline underline-offset-4" href={`tel:${v.phone}`}>
                      {v.phone}
                    </a>{" "}
                    ·{" "}
                    <a className="underline underline-offset-4" href={`mailto:${v.email}`}>
                      {v.email}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Requested {formatDate(v.createdAt)}</p>
                </div>
                <Select value={v.status} onValueChange={(s) => void setStatus(v.id, s as ViewingStatus)}>
                  <SelectTrigger className="w-44">
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
              {v.message && (
                <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                  {v.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
