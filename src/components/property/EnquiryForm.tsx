import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEnquiry } from "@/lib/store";
import { isValidEmail, isValidKenyanPhone } from "@/lib/format";
import type { Property } from "@/lib/types";

export function EnquiryForm({ property }: { property: Property }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I would like more information about ${property.title}.`,
    preferredDate: "",
    preferredContact: "phone" as "phone" | "email" | "whatsapp",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next["name"] = "Please enter your name.";
    if (!isValidEmail(form.email)) next["email"] = "Please enter a valid email address.";
    if (!isValidKenyanPhone(form.phone)) next["phone"] = "Enter a valid Kenyan number, e.g. 0712 345 678.";
    if (form.message.trim().length < 10) next["message"] = "Please add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await createEnquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        preferredDate: form.preferredDate,
        preferredContact: form.preferredContact,
        status: "new",
        createdAt: new Date().toISOString(),
      });
      setSent(true);
      toast.success("Enquiry sent", { description: "We will be in touch shortly." });
    } catch {
      toast.error("Your enquiry could not be sent", {
        description: "Please try again, or call us directly.",
      });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-md border border-border bg-card p-6">
        <h3 className="text-base font-semibold">Thank you — your enquiry has been received.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A member of the Property Masters team will respond using your preferred contact method.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setSent(false)}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="e-name" className="eyebrow mb-1.5 block">
          Name <span aria-hidden>*</span>
        </label>
        <Input id="e-name" required aria-invalid={!!errors["name"]} {...field("name")} />
        {errors["name"] && <p className="mt-1 text-xs text-destructive">{errors["name"]}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="e-email" className="eyebrow mb-1.5 block">
            Email <span aria-hidden>*</span>
          </label>
          <Input id="e-email" type="email" required aria-invalid={!!errors["email"]} {...field("email")} />
          {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
        </div>
        <div>
          <label htmlFor="e-phone" className="eyebrow mb-1.5 block">
            Phone <span aria-hidden>*</span>
          </label>
          <Input id="e-phone" type="tel" required aria-invalid={!!errors["phone"]} {...field("phone")} />
          {errors["phone"] && <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="e-date" className="eyebrow mb-1.5 block">
            Preferred viewing date
          </label>
          <Input id="e-date" type="date" {...field("preferredDate")} />
        </div>
        <div>
          <label htmlFor="e-contact" className="eyebrow mb-1.5 block">
            Preferred contact
          </label>
          <Select
            value={form.preferredContact}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, preferredContact: v as typeof form.preferredContact }))
            }
          >
            <SelectTrigger id="e-contact">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone call</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label htmlFor="e-message" className="eyebrow mb-1.5 block">
          Message <span aria-hidden>*</span>
        </label>
        <Textarea id="e-message" rows={4} required aria-invalid={!!errors["message"]} {...field("message")} />
        {errors["message"] && <p className="mt-1 text-xs text-destructive">{errors["message"]}</p>}
      </div>
      <Button type="submit" size="lg" disabled={sending} className="w-full">
        {sending ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
