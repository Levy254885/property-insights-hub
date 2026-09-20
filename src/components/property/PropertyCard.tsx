import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Heart, Maximize } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatPrice, formatSize, propertyLocation, statusLabel } from "@/lib/format";
import { useFavorites } from "@/lib/favorites";
import { optimizedUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, typeName }: { property: Property; typeName?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(property.id);
  const size = formatSize(property.propertySize ?? property.landSize, property.sizeUnit);
  const closed = property.status === "sold" || property.status === "rented";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-card transition-shadow duration-200 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={optimizedUrl(property.primaryImage, 800)}
          alt={property.images[0]?.alt ?? property.title}
          loading="lazy"
          width={1280}
          height={960}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          {/*
            Use literal white/black — not theme tokens.
            .bg-card forces text-foreground → dark, which made black chips unreadable.
          */}
          <span
            className={cn(
              "rounded-sm px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] shadow-sm",
              closed
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-900",
            )}
          >
            {statusLabel(property)}
          </span>
          {property.featured && !closed && (
            <span className="rounded-sm bg-bronze px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-bronze-foreground shadow-sm">
              Featured
            </span>
          )}
          {property.isDemo && (
            <span className="rounded-sm bg-neutral-800 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
              Demo
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(property.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${property.title} from saved` : `Save ${property.title}`}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-neutral-900 shadow-sm backdrop-blur-sm transition-transform duration-150 hover:scale-105"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              saved ? "fill-bronze text-bronze" : "text-neutral-800",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5 text-card-foreground">
        <p className="text-lg font-bold tracking-tight text-card-foreground">
          {formatPrice(property.price, property.listingType)}
        </p>
        <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-card-foreground">
          <Link
            to="/properties/$slug"
            params={{ slug: property.slug }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {property.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-card-muted">{propertyLocation(property)}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-card-muted">
          {property.bedrooms ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} bed
            </span>
          ) : null}
          {property.bathrooms ? (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5" /> {property.bathrooms} bath
            </span>
          ) : null}
          {size ? (
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5" /> {size}
            </span>
          ) : null}
          {typeName ? <span className="ml-auto text-card-foreground/70">{typeName}</span> : null}
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
