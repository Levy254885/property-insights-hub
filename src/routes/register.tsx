import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account | Property Masters" },
      { name: "description", content: "Create a Property Masters account to save properties and track enquiries." },
      { property: "og:title", content: "Create an account | Property Masters" },
      { property: "og:description", content: "Save listings and manage your enquiries." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/register" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setBusy(true);
    try {
      await signUp(form.name, form.email, form.password);
      void navigate({ to: "/account" });
    } catch (error) {
      toast.error("Could not create account", { description: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-20">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-8">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {(["name", "email", "password"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={`r-${k}`} className="eyebrow mb-1.5 block">
                {k}
              </label>
              <Input
                id={`r-${k}`}
                type={k === "password" ? "password" : k === "email" ? "email" : "text"}
                required
                value={form[k]}
                onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
              />
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
