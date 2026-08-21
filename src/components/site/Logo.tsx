import logoAsset from "@/assets/logo.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * The official Property Masters logo, used unmodified.
 * The wordmark is white, so the logo always sits on the brand ink panel.
 */
export function Logo({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-sm bg-ink px-3 py-2",
        className,
      )}
    >
      <img
        src={logoAsset.url}
        alt="Property Masters — with you all the way"
        width={1920}
        height={1440}
        className={cn("h-9 w-auto object-contain", imgClassName)}
      />
    </span>
  );
}
