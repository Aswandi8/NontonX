import Link from "next/link";
import { Plus } from "lucide-react";

import DashboardHeader from "@/components/dashboard/header/Header";
import { Heading, Text } from "@/components/typography";
import prisma from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          videos: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Categories"
        breadcrumb={["Admin", "Categories"]}
      />

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading className="text-xl font-semibold">All Categories</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Manage categories for your videos.
            </Text>
          </div>

          <Link
            href="/dashboard/categories/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add Category
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {categories.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center p-6">
              <div className="text-center">
                <Heading className="text-lg font-semibold">
                  No categories
                </Heading>

                <Text className="mt-1 text-sm text-muted-foreground">
                  Start by creating your first category.
                </Text>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-3 p-4 transition-colors duration-200 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <Text className="truncate font-medium">
                      {category.name}
                    </Text>

                    <Text className="mt-1 text-xs text-muted-foreground">
                      {category._count.videos} videos
                    </Text>
                  </div>

                  <Text className="truncate text-xs text-muted-foreground">
                    /{category.slug}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
