import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Property Masters" },
      { name: "description", content: "Sign in to save properties and manage your Property Masters account." },
      { property: "og:title", content: "Sign in | Property Masters" },
      { property: "og:description", content: "Access your saved properties and enquiries." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      void navigate({ to: "/account" });
    } catch (error) {
      toast.error("Could not sign in", { description: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-20">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="l-email" className="eyebrow mb-1.5 block">
              Email
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
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() =>
            void signInWithGoogle()
              .then(() => navigate({ to: "/account" }))
              .catch((e: Error) => toast.error("Google sign-in failed", { description: e.message }))
          }
        >
          Continue with Google
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">
          No account?{" "}
          <Link to="/register" className="font-semibold text-foreground underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
