import { notFound } from "next/navigation";

import Navbar from "@/components/homepage/Navbar";
import { Text } from "@/components/typography";

import prisma from "@/lib/prisma";

interface VideoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;

  const video = await prisma.video.findUnique({
    where: {
      slug,
    },

    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  /* =========================================
     VIDEO NOT FOUND
  ========================================= */

  if (!video || !video.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* =====================================
          NAVBAR
      ====================================== */}

      <Navbar />

      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ===================================
            VIDEO PLAYER
        ==================================== */}

        <div className="overflow-hidden rounded-xl bg-black">
          <video
            src={video.videoUrl}
            controls
            playsInline
            preload="metadata"
            poster={video.thumbnail ?? undefined}
            className="aspect-video h-auto w-full"
          >
            Your browser does not support the video player.
          </video>
        </div>

        {/* ===================================
            VIDEO INFORMATION
        ==================================== */}

        <div className="mt-6">
          {/* TITLE */}

          <h1 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {video.title}
          </h1>

          {/* DESCRIPTION */}

          {video.description && (
            <Text className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {video.description}
            </Text>
          )}

          {/* CATEGORIES */}

          {video.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {video.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
