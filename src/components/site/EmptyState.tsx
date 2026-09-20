import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  actions,
  icon,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-card px-6 py-16 text-center text-card-foreground">
      {icon && <div className="mb-4 text-card-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-card-muted">{description}</p>
      )}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
