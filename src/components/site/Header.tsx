import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Heart, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import { useFavorites } from "@/lib/favorites";
import { defaultSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "Land", to: "/land" },
  { label: "Commercial", to: "/commercial" },
  { label: "Locations", to: "/locations" },
  { label: "About", to: "/about" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tel = `tel:${defaultSettings.phone.replace(/\s/g, "")}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link to="/" aria-label="Property Masters home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(item.to) && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" asChild aria-label="Search properties">
            <Link to="/properties">
              <Search />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label={`Saved properties (${favorites.length})`}>
            <Link to="/favorites" className="relative">
              <Heart />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bronze px-1 text-[0.625rem] font-bold text-bronze-foreground">
                  {favorites.length}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={tel}>
              <Phone /> {defaultSettings.phone}
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/properties">Explore Properties</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/contact">Enquire Now</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Button variant="ghost" size="icon" asChild aria-label="Saved properties">
            <Link to="/favorites">
              <Heart />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav aria-label="Mobile" className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-14">
                {primaryNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-4 text-lg font-medium text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/properties"
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 text-lg font-medium text-foreground"
                >
                  All Properties
                </Link>
                <Link
                  to="/specialists"
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 text-lg font-medium text-foreground"
                >
                  Property Specialists
                </Link>
                <Link
                  to="/insights"
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 text-lg font-medium text-foreground"
                >
                  Insights
                </Link>
                <div className="mt-8 flex flex-col gap-3">
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/properties">Explore Properties</Link>
                  </Button>
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/contact">Enquire Now</Link>
                  </Button>
                  <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                    <a href={tel}>Call {defaultSettings.phone}</a>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
