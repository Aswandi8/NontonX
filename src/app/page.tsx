import prisma from "@/lib/prisma";

import Navbar from "@/components/homepage/Navbar";
import VideoGrid from "@/components/homepage/VideoGrid";

export default async function HomePage() {
  const videos = await prisma.video.findMany({
    where: {
      isPublished: true,
    },

    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 12,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <section>
          {/* =================================
              SECTION HEADER
          ================================== */}

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">
              Latest Videos
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Watch the latest videos on NontonX.
            </p>
          </div>

          {/* =================================
              VIDEO GRID
          ================================== */}

          <VideoGrid videos={videos} />
        </section>
      </main>
    </div>
  );
}
