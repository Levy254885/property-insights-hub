import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultSettings } from "@/lib/settings";
import { isValidEmail, isValidKenyanPhone, whatsappLink } from "@/lib/format";
import { createEnquiry } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Property Masters | Kenya property enquiries" },
      { name: "description", content: "Call, WhatsApp or email Property Masters about buying, renting or listing property in Kenya." },
      { property: "og:title", content: "Contact Property Masters" },
      { property: "og:description", content: "Get in touch about buying, renting or listing a property." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const s = defaultSettings;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next["name"] = "Please enter your name.";
    if (!isValidEmail(form.email)) next["email"] = "Enter a valid email address.";
    if (!isValidKenyanPhone(form.phone)) next["phone"] = "Enter a valid Kenyan number.";
    if (form.message.trim().length < 10) next["message"] = "Please add a short message.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      await createEnquiry({
        propertyId: "general",
        propertyTitle: "General enquiry",
        ...form,
        preferredContact: "email",
        status: "new",
        createdAt: new Date().toISOString(),
      });
      toast.success("Message sent", { description: "We will get back to you shortly." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Your message could not be sent", { description: "Please call or WhatsApp us instead." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container-page grid gap-14 py-14 lg:grid-cols-2 lg:py-20">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Talk to Property Masters</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Buying, renting or listing — send us the details and we will come back to you.
        </p>
        <dl className="mt-10 space-y-6 text-sm">
          <div>
            <dt className="eyebrow">Phone</dt>
            <dd className="mt-1">
              <a className="underline underline-offset-4" href={`tel:${s.phone.replace(/\s/g, "")}`}>
                {s.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">WhatsApp</dt>
            <dd className="mt-1">
              <a
                className="underline underline-offset-4"
                href={whatsappLink(s.whatsapp, "Hello Property Masters, I would like some assistance.")}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s.whatsapp}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Email</dt>
            <dd className="mt-1">
              <a className="underline underline-offset-4" href={`mailto:${s.email}`}>
                {s.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Office</dt>
            <dd className="mt-1 text-muted-foreground">{s.address}</dd>
          </div>
          <div>
            <dt className="eyebrow">Business hours</dt>
            <dd className="mt-1 text-muted-foreground">{s.businessHours}</dd>
          </div>
        </dl>
        <div className="mt-10 grid h-56 place-items-center rounded-md border border-dashed border-border-strong bg-secondary/50 text-sm text-muted-foreground">
          Map will be added once the office address is confirmed.
        </div>
      </div>

      <form onSubmit={submit} noValidate className="rounded-md border border-border bg-card p-6 lg:p-8">
        <h2 className="text-lg font-bold">Send a message</h2>
        <div className="mt-6 space-y-4">
          {(["name", "email", "phone"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={`c-${k}`} className="eyebrow mb-1.5 block">
                {k === "name" ? "Name" : k === "email" ? "Email" : "Phone"} <span aria-hidden>*</span>
              </label>
              <Input
                id={`c-${k}`}
                type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
                value={form[k]}
                aria-invalid={!!errors[k]}
                onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
              />
              {errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="c-message" className="eyebrow mb-1.5 block">
              Message <span aria-hidden>*</span>
            </label>
            <Textarea
              id="c-message"
              rows={5}
              value={form.message}
              aria-invalid={!!errors["message"]}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            {errors["message"] && <p className="mt-1 text-xs text-destructive">{errors["message"]}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
