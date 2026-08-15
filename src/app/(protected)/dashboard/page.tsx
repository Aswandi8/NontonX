import { Folder, Heart, PlaySquare, Users } from "lucide-react";

import DashboardHeader from "@/components/dashboard/header/Header";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { Heading, Text } from "@/components/typography";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const [totalVideos, totalCategories, totalUsers, totalFavorites] =
    await Promise.all([
      prisma.video.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.favorite.count(),
    ]);

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" breadcrumb={["Admin", "Dashboard"]} />

      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStatCard
              title="Total Videos"
              value={totalVideos}
              description="Videos available"
              icon={PlaySquare}
            />

            <DashboardStatCard
              title="Categories"
              value={totalCategories}
              description="Active categories"
              icon={Folder}
            />

            <DashboardStatCard
              title="Users"
              value={totalUsers}
              description="Registered users"
              icon={Users}
            />

            <DashboardStatCard
              title="Favorites"
              value={totalFavorites}
              description="Saved videos"
              icon={Heart}
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <Heading className="text-lg font-semibold">Recent Videos</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Recently added videos will appear here.
            </Text>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex min-h-60 items-center justify-center p-6">
              <Text className="text-sm text-muted-foreground">
                No videos available yet.
              </Text>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
