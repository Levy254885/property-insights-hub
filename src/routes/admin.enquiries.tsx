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
import { useEnquiries } from "@/lib/queries";
import { updateEnquiryStatus } from "@/lib/store";
import type { EnquiryStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiries,
});

const statuses: Array<{ value: EnquiryStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "viewing_requested", label: "Viewing requested" },
  { value: "viewing_scheduled", label: "Viewing scheduled" },
  { value: "negotiating", label: "Negotiating" },
  { value: "closed", label: "Closed" },
  { value: "not_interested", label: "Not interested" },
];

function AdminEnquiries() {
  const { data: enquiries } = useEnquiries();
  const qc = useQueryClient();

  async function setStatus(id: string, status: EnquiryStatus) {
    try {
      await updateEnquiryStatus(id, status);
      await qc.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Lead updated");
    } catch (error) {
      toast.error("Could not update lead", { description: (error as Error).message });
    }
  }

  const sorted = [...enquiries].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div>
      <h2 className="text-lg font-bold">Enquiries</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Buyer and tenant leads captured from property pages and the contact form.
      </p>

      {sorted.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-border-strong p-6 text-sm text-muted-foreground">
          No enquiries yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {sorted.map((e) => (
            <li key={e.id} className="rounded-md border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold">{e.name}</p>
                  <p className="text-sm text-muted-foreground">{e.propertyTitle}</p>
                  <p className="mt-2 text-sm">
                    <a className="underline underline-offset-4" href={`tel:${e.phone}`}>
                      {e.phone}
                    </a>{" "}
                    ·{" "}
                    <a className="underline underline-offset-4" href={`mailto:${e.email}`}>
                      {e.email}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prefers {e.preferredContact}
                    {e.preferredDate ? ` · viewing ${e.preferredDate}` : ""} · {formatDate(e.createdAt)}
                  </p>
                </div>
                <Select value={e.status} onValueChange={(v) => void setStatus(e.id, v as EnquiryStatus)}>
                  <SelectTrigger className="w-52">
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
              <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                {e.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
