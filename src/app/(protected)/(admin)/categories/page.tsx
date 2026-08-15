import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

import Header from "@/components/dashboard/header/Header";
import CategoryTable from "@/components/category/CategoryTable";
import { Heading, Text } from "@/components/typography";
import prisma from "@/lib/prisma";

const DEFAULT_LIMIT = 10;
const ALLOWED_LIMITS = [10, 25, 50, 100] as const;

type SortField = "name" | "slug" | "videos" | "createdAt";
type SortOrder = "asc" | "desc";

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
    limit?: string;
  }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || "";

  const requestedLimit = Number(params.limit);

  const limit = ALLOWED_LIMITS.includes(
    requestedLimit as (typeof ALLOWED_LIMITS)[number],
  )
    ? requestedLimit
    : DEFAULT_LIMIT;

  const allowedSorts: SortField[] = ["name", "slug", "videos", "createdAt"];

  const validSort: SortField = allowedSorts.includes(params.sort as SortField)
    ? (params.sort as SortField)
    : "createdAt";

  const order: SortOrder = params.order === "asc" ? "asc" : "desc";

  const where: Prisma.CategoryWhereInput | undefined = search
    ? {
        OR: [
          {
            name: {
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

  const orderBy: Prisma.CategoryOrderByWithRelationInput =
    validSort === "videos"
      ? {
          videos: {
            _count: order,
          },
        }
      : validSort === "name"
        ? {
            name: order,
          }
        : validSort === "slug"
          ? {
              slug: order,
            }
          : {
              createdAt: order,
            };

  const total = await prisma.category.count({
    where,
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const requestedPage = Math.max(1, Number(params.page) || 1);

  const page = Math.min(requestedPage, totalPages);

  const categories = await prisma.category.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
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
      <Header title="Categories" breadcrumb={["Admin", "Categories"]} />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading className="text-xl font-semibold">All Categories</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Manage categories for your videos.
            </Text>
          </div>

          <Link
            href="/categories/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create Category
          </Link>
        </div>

        <CategoryTable
          categories={categories}
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
