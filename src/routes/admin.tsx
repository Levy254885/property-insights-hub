import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Internal dashboard | Property Masters" },
      { name: "description", content: "Property Masters internal inventory and lead management." },
      { property: "og:title", content: "Internal dashboard | Property Masters" },
      { property: "og:description", content: "Staff-only inventory and lead management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { label: "Overview", to: "/admin" as const, exact: true },
  { label: "Properties", to: "/admin/properties" as const, exact: false },
  { label: "Enquiries", to: "/admin/enquiries" as const, exact: false },
  { label: "Viewing requests", to: "/admin/viewings" as const, exact: false },
  { label: "Content", to: "/admin/content" as const, exact: false },
  { label: "Settings", to: "/admin/settings" as const, exact: false },
];

function AdminLayout() {
  const { user, role, loading, isStaff, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="container-page py-24">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!user || !isStaff) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-md rounded-md border border-border bg-card p-8 text-center">
          <p className="eyebrow">Restricted</p>
          <h1 className="mt-2 text-xl font-bold">Staff access only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user
              ? "This account does not have access to the Property Masters dashboard."
              : "Sign in with your Property Masters staff account to manage inventory and leads."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/login">Staff sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow">Property Masters</p>
          <h1 className="mt-1 text-2xl font-extrabold">Internal dashboard</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {user.email} · {role}
          </span>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Dashboard" className="flex flex-wrap gap-2 lg:flex-col">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
