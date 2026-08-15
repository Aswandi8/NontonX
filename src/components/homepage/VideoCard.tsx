import Link from "next/link";
import { Clock, Play } from "lucide-react";

import { Image } from "@/components/media";
import { Text } from "@/components/typography";

import { cn } from "@/lib/utils";

interface VideoCardCategory {
  id: string;
  name: string;
}

export interface VideoCardProps {
  slug: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  duration?: number | null;
  categories?: VideoCardCategory[];
  className?: string;
}

export function VideoCard({
  slug,
  title,
  description,
  thumbnail,
  duration,
  categories = [],
  className,
}: VideoCardProps) {
  return (
    <Link
      href={`/video/${slug}`}
      className={cn(
        "group block min-w-0 overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      {/* =====================================
          VIDEO
      ====================================== */}

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="size-8 text-muted-foreground" />
          </div>
        )}

        {/* Duration */}

        {duration !== null && duration !== undefined && (
          <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            <Clock className="size-3" />

            {formatDuration(duration)}
          </div>
        )}
      </div>

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="p-3">
        {/* ===================================
            JUDUL
        ==================================== */}

        <Text className="line-clamp-2 text-sm font-semibold leading-5 text-foreground transition-colors duration-200 group-hover:text-primary sm:text-[15px]">
          {title}
        </Text>

        {/* ===================================
            DESKRIPSI
        ==================================== */}

        {description && (
          <Text className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {description}
          </Text>
        )}

        {/* ===================================
            KATEGORI
        ==================================== */}

        {categories.length > 0 && (
          <div className="mt-2.5 flex min-w-0 flex-wrap gap-1.5">
            {categories.map((category) => (
              <span
                key={category.id}
                className="max-w-full truncate rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(duration: number) {
  if (duration < 0) {
    return "--";
  }

  const hours = Math.floor(duration / 3600);

  const minutes = Math.floor((duration % 3600) / 60);

  const seconds = duration % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
