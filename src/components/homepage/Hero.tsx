import Link from "next/link";

import { Play } from "lucide-react";

import { Image } from "@/components/media";

interface HeroVideo {
  slug: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: number | null;

  categories: {
    id: string;
    name: string;
  }[];
}

interface HeroProps {
  video: HeroVideo;
}

export default function Hero({ video }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* BACKGROUND */}

      <div className="absolute inset-0">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* CONTENT */}

      <div className="relative mx-auto flex min-h-[520px] max-w-[1600px] items-end px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* CATEGORY */}

          {video.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {video.categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* TITLE */}

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {video.title}
          </h1>

          {/* DESCRIPTION */}

          {video.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/70 sm:text-base">
              {video.description}
            </p>
          )}

          {/* ACTION */}

          <div className="mt-6">
            <Link
              href={`/videos/${video.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Play className="size-4 fill-current" />
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
