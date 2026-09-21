import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateImageFile, ACCEPTED_IMAGE_TYPES } from "@/lib/storage";
import { optimizedUrl, uploadToCloudinary } from "@/lib/cloudinary";
import type { PropertyImage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Pending {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

/**
 * Unlimited-count property image manager. Files are compressed then uploaded
 * to Cloudinary one at a time with automatic retries.
 */
export function ImageUploader({
  propertyId,
  images,
  primaryImage,
  onChange,
  altBase,
}: {
  propertyId: string;
  images: PropertyImage[];
  primaryImage: string;
  onChange: (images: PropertyImage[], primaryImage: string) => void;
  altBase: string;
}) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  function commit(next: PropertyImage[], primary?: string) {
    const cover =
      primary ??
      (next.some((i) => i.url === primaryImage) ? primaryImage : (next[0]?.url ?? ""));
    onChange(next, cover);
  }

  async function uploadOne(item: Pending, current: PropertyImage[]): Promise<PropertyImage[]> {
    try {
      const uploaded = await uploadToCloudinary(
        item.file,
        `property-masters/${propertyId}`,
        (p) => setPending((list) => list.map((x) => (x.id === item.id ? { ...x, progress: p } : x))),
      );
      const next = [
        ...current,
        { ...uploaded, alt: altBase || "Property Masters property photograph" },
      ];
      commit(next);
      setPending((list) => list.filter((x) => x.id !== item.id));
      URL.revokeObjectURL(item.preview);
      return next;
    } catch (error) {
      setPending((list) =>
        list.map((x) => (x.id === item.id ? { ...x, error: (error as Error).message } : x)),
      );
      return current;
    }
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const existingKeys = new Set(imagesRef.current.map((i) => `${i.filename}-${i.size}`));
    const queue: Pending[] = [];

    for (const file of files) {
      const problem = validateImageFile(file);
      if (problem) {
        toast.error(problem);
        continue;
      }
      if (existingKeys.has(`${file.name}-${file.size}`)) {
        toast.message(`${file.name} is already attached — skipped.`);
        continue;
      }
      queue.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      });
    }
    if (queue.length === 0) return;
    setPending((list) => [...list, ...queue]);

    // One at a time + short pause so large batches stay reliable on mobile data.
    let current = imagesRef.current;
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]!;
      current = await uploadOne(item, current);
      imagesRef.current = current;
      if (i < queue.length - 1) {
        await new Promise((r) => setTimeout(r, 350));
      }
    }

    const failed = queue.length; // toast summary from pending state is awkward; keep simple
    void failed;
  }

  async function retry(item: Pending) {
    setPending((list) =>
      list.map((x): Pending =>
        x.id === item.id ? { id: x.id, file: x.file, preview: x.preview, progress: 0 } : x,
      ),
    );
    const next = await uploadOne({ ...item, progress: 0 }, imagesRef.current);
    imagesRef.current = next;
  }

  async function remove(index: number) {
    const image = images[index];
    if (!image) return;
    const next = images.filter((_, i) => i !== index);
    commit(next);
    if (image.path && !image.path.startsWith("property-masters/")) {
      const { deletePropertyImage } = await import("@/lib/storage");
      await deletePropertyImage(image);
    }
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    commit(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-md border-2 border-dashed border-border p-6 text-center transition-colors",
          dragOver && "border-bronze bg-secondary",
        )}
      >
        <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">Drag photographs here, or choose files</p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG or WebP · up to 10MB each · large photos are compressed automatically · uploaded one at a time
        </p>
        <Input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
        >
          Select images
        </Button>
      </div>

      {pending.length > 0 && (
        <ul className="mt-4 space-y-2">
          {pending.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-sm border border-border bg-card p-2 text-card-foreground"
            >
              <img src={item.preview} alt="" className="h-12 w-16 rounded-sm object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-card-foreground">{item.file.name}</p>
                {item.error ? (
                  <p className="text-xs text-destructive">{item.error}</p>
                ) : (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-bronze transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {item.error && (
                <Button type="button" variant="outline" size="sm" onClick={() => void retry(item)}>
                  <RefreshCw /> Retry
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 eyebrow">
        {images.length} image{images.length === 1 ? "" : "s"} attached
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <li key={`${img.url}-${i}`} className="overflow-hidden rounded-sm border border-border bg-card">
            <div className="relative aspect-[4/3] bg-muted">
              <img
                src={optimizedUrl(img.url, 480)}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {img.url === primaryImage && (
                <span className="absolute left-1.5 top-1.5 rounded-sm bg-bronze px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-bronze-foreground">
                  Cover
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 p-1.5">
              <div className="flex gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Move earlier"
                  onClick={() => move(i, -1)}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Move later"
                  onClick={() => move(i, 1)}
                >
                  <ArrowRight />
                </Button>
              </div>
              <div className="flex gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Set as cover image"
                  onClick={() => commit(images, img.url)}
                >
                  <Star className={cn(img.url === primaryImage && "fill-bronze text-bronze")} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Delete image"
                  onClick={() => void remove(i)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
