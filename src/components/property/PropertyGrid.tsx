import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";
import type { Property, PropertyType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PropertyGrid({
  properties,
  types,
  loading,
  columns = 3,
}: {
  properties: Property[];
  types: PropertyType[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const typeName = (id: string) => types.find((t) => t.id === id)?.name;
  const grid = cn(
    "grid gap-6 sm:grid-cols-2",
    columns === 3 && "lg:grid-cols-3",
    columns === 4 && "lg:grid-cols-4",
  );

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={grid}>
      {properties.map((p) => {
        const name = typeName(p.propertyTypeId);
        return <PropertyCard key={p.id} property={p} {...(name ? { typeName: name } : {})} />;
      })}
    </div>
  );
}

