import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Staff sign in | Property Masters" },
      {
        name: "description",
        content: "Internal sign in for Property Masters staff managing property inventory and leads.",
      },
      { property: "og:title", content: "Staff sign in | Property Masters" },
      { property: "og:description", content: "Internal access for the Property Masters team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

const DEFAULT_ADMIN_EMAIL = "admin@propertymasters.co.ke";
const DEFAULT_ADMIN_PASSWORD = "PropertyMasters2026!";

function LoginPage() {
  const { signIn, bootstrapAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [setupBusy, setSetupBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      void navigate({ to: "/admin" });
    } catch (error) {
      toast.error("Could not sign in", { description: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  /** Creates the default administrator the first time the site is deployed. */
  async function runSetup() {
    setSetupBusy(true);
    try {
      await bootstrapAdmin(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
      toast.success("Administrator account created", {
        description: `${DEFAULT_ADMIN_EMAIL} is ready — you are signed in.`,
      });
      void navigate({ to: "/admin" });
    } catch (error) {
      const message = (error as Error).message;
      toast.error(
        message.includes("email-already-in-use")
          ? "The administrator account already exists — sign in below."
          : "Could not create the administrator account",
        { description: message },
      );
    } finally {
      setSetupBusy(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-20">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-8">
        <p className="eyebrow">Internal access</p>
        <h1 className="mt-2 text-2xl font-bold">Staff sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is for Property Masters staff. Looking for a property?{" "}
          <a href="/properties" className="font-semibold text-foreground underline underline-offset-4">
            Explore properties
          </a>
          .
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="l-email" className="eyebrow mb-1.5 block">
              Work email
            </label>
            <Input id="l-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="l-pass" className="eyebrow mb-1.5 block">
              Password
            </label>
            <Input
              id="l-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground">
          Accounts are created by an administrator. Contact your manager if you need access.
        </p>
      </div>
    </div>
  );
}
