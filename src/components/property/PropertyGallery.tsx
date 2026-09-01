import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PropertyImage } from "@/lib/types";
import { optimizedUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const count = images.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, count]);

  if (count === 0) return null;
  const current = images[index]!;

  return (
    <section aria-label="Property images">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted"
        onTouchStart={(e) => setTouchStart(e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchStart === null) return;
          const delta = (e.changedTouches[0]?.clientX ?? touchStart) - touchStart;
          if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
          setTouchStart(null);
        }}
      >
        <img
          src={optimizedUrl(current.url, 1600)}
          alt={current.alt || title}
          width={1280}
          height={800}
          className="h-full w-full object-cover"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <Button
          variant="onImage"
          size="sm"
          className="absolute bottom-3 right-3"
          onClick={() => setOpen(true)}
        >
          <Expand /> View full screen
        </Button>
        <span className="absolute bottom-3 left-3 rounded-sm bg-background/90 px-2 py-1 text-xs font-medium">
          {index + 1} / {count}
        </span>
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-20 w-28 shrink-0 overflow-hidden rounded-sm border-2 transition-colors",
                i === index ? "border-bronze" : "border-transparent hover:border-border-strong",
              )}
            >
              <img
                src={optimizedUrl(img.url, 320)}
                alt={img.alt || `${title} thumbnail ${i + 1}`}
                loading="lazy"
                width={224}
                height={160}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[96vw] border-none bg-ink p-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">{title} gallery</DialogTitle>
          <div className="relative">
            <img src={optimizedUrl(current.url, 1920)} alt={current.alt || title} className="max-h-[80vh] w-full object-contain" />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
