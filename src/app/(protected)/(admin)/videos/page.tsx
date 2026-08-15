import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

import Header from "@/components/dashboard/header/Header";
import VideoTable from "@/components/video/VideoTable";
import { Heading, Text } from "@/components/typography";

import prisma from "@/lib/prisma";

const DEFAULT_LIMIT = 10;
const ALLOWED_LIMITS = [10, 25, 50, 100] as const;

type SortField = "title" | "slug" | "duration" | "isPublished" | "createdAt";

type SortOrder = "asc" | "desc";

interface VideosPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
    limit?: string;
  }>;
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;

  /* =========================================
     SEARCH
  ========================================= */

  const search = params.search?.trim() || "";

  /* =========================================
     LIMIT
  ========================================= */

  const requestedLimit = Number(params.limit);

  const limit = ALLOWED_LIMITS.includes(
    requestedLimit as (typeof ALLOWED_LIMITS)[number],
  )
    ? requestedLimit
    : DEFAULT_LIMIT;

  /* =========================================
     SORT
  ========================================= */

  const allowedSorts: SortField[] = [
    "title",
    "slug",
    "duration",
    "isPublished",
    "createdAt",
  ];

  const validSort: SortField = allowedSorts.includes(params.sort as SortField)
    ? (params.sort as SortField)
    : "createdAt";

  const order: SortOrder = params.order === "asc" ? "asc" : "desc";

  /* =========================================
     WHERE
  ========================================= */

  const where: Prisma.VideoWhereInput | undefined = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            slug: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : undefined;

  /* =========================================
     ORDER BY
  ========================================= */

  const orderBy: Prisma.VideoOrderByWithRelationInput =
    validSort === "title"
      ? {
          title: order,
        }
      : validSort === "slug"
        ? {
            slug: order,
          }
        : validSort === "duration"
          ? {
              duration: order,
            }
          : validSort === "isPublished"
            ? {
                isPublished: order,
              }
            : {
                createdAt: order,
              };

  /* =========================================
     TOTAL
  ========================================= */

  const total = await prisma.video.count({
    where,
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  /* =========================================
     PAGE
  ========================================= */

  const requestedPage = Math.max(1, Number(params.page) || 1);

  const page = Math.min(requestedPage, totalPages);

  /* =========================================
     VIDEOS
  ========================================= */

  const videos = await prisma.video.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen">
      {/* =====================================
          HEADER
      ====================================== */}

      <Header title="Videos" breadcrumb={["Admin", "Videos"]} />

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading className="text-xl font-semibold">All Videos</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Manage videos available on NontonX.
            </Text>
          </div>

          {/* =================================
              CREATE VIDEO
          ================================== */}

          <Link
            href="/videos/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create Video
          </Link>
        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <VideoTable
          videos={videos}
          total={total}
          page={page}
          totalPages={totalPages}
          limit={limit}
          search={search}
          sort={validSort}
          order={order}
          allowedLimits={[...ALLOWED_LIMITS]}
        />
      </div>
    </div>
  );
}
