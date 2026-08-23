import { cn } from "@/lib/utils";

/**
 * The official Property Masters logo, used unmodified (transparent PNG).
 * `tone="light"` renders the charcoal wordmark for light surfaces;
 * `tone="dark"` renders the original white wordmark for dark surfaces.
 * Both are served from /public so they render on any deployment target.
 */
export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <img
      src={tone === "dark" ? "/logo.png" : "/logo-dark.png"}
      alt="Property Masters — with you all the way"
      width={736}
      height={400}
      className={cn("h-10 w-auto object-contain lg:h-12", className)}
    />
  );
}
