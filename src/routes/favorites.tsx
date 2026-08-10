import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { EmptyState } from "@/components/site/EmptyState";
import { useFavorites } from "@/lib/favorites";
import { useProperties, usePropertyTypes } from "@/lib/queries";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Saved properties | Property Masters" },
      { name: "description", content: "The properties you have saved while browsing Property Masters." },
      { property: "og:title", content: "Saved properties | Property Masters" },
      { property: "og:description", content: "Review and compare the listings you have saved." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/favorites" },
    ],
    links: [{ rel: "canonical", href: "/favorites" }],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const { data: properties } = useProperties();
  const { data: types } = usePropertyTypes();
  const saved = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Saved</p>
          <h1 className="mt-3 text-3xl font-extrabold">Your saved properties</h1>
        </div>
        {saved.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearFavorites}>
            Clear all
          </Button>
        )}
      </div>

      <div className="mt-10">
        {saved.length ? (
          <PropertyGrid properties={saved} types={types} />
        ) : (
          <EmptyState
            icon={<Heart className="h-6 w-6" />}
            title="You haven't saved any properties yet."
            description="Tap the heart on any listing to keep it here. Sign in to keep your saved list across devices."
            actions={
              <>
                <Button asChild>
                  <Link to="/properties">Browse properties</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              </>
            }
          />
        )}
      </div>
    </div>
  );
}
