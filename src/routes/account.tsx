import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account | Property Masters" },
      { name: "description", content: "Manage your Property Masters account and saved properties." },
      { property: "og:title", content: "My account | Property Masters" },
      { property: "og:description", content: "Your saved properties and account details." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, role, loading, logout, isAdmin } = useAuth();
  const { favorites } = useFavorites();

  if (loading) {
    return (
      <div className="container-page py-20">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">You are not signed in</h1>
        <p className="mt-3 text-sm text-muted-foreground">Sign in to view your account.</p>
        <Button className="mt-8" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-14 lg:py-20">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 text-3xl font-extrabold">{user.displayName || user.email}</h1>
      <dl className="mt-8 grid max-w-xl gap-5 text-sm">
        <div>
          <dt className="eyebrow">Email</dt>
          <dd className="mt-1">{user.email}</dd>
        </div>
        <div>
          <dt className="eyebrow">Role</dt>
          <dd className="mt-1 capitalize">{role?.replace("_", " ") ?? "customer"}</dd>
        </div>
        <div>
          <dt className="eyebrow">Saved properties</dt>
          <dd className="mt-1">{favorites.length}</dd>
        </div>
      </dl>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/favorites">View saved properties</Link>
        </Button>
        {isAdmin && (
          <Button asChild>
            <Link to="/admin">Admin dashboard</Link>
          </Button>
        )}
        <Button variant="ghost" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
