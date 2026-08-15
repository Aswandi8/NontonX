import type { Prisma } from "@/generated/prisma/client";

import Header from "@/components/dashboard/header/Header";
import UserTable from "@/components/user/UserTable";
import { Heading, Text } from "@/components/typography";

import prisma from "@/lib/prisma";

/* =========================================
   TYPES
========================================= */

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sort?: string;
    order?: string;
  }>;
}

/* =========================================
   CONSTANTS
========================================= */

const ALLOWED_LIMITS = [10, 25, 50, 100];

const ALLOWED_SORTS = [
  "name",
  "email",
  "role",
  "isActive",
  "createdAt",
] as const;

/* =========================================
   PAGE
========================================= */

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  /* =========================================
     PAGE
  ========================================= */

  const parsedPage = Number(params.page);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  /* =========================================
     LIMIT
  ========================================= */

  const parsedLimit = Number(params.limit);

  const limit = ALLOWED_LIMITS.includes(parsedLimit) ? parsedLimit : 10;

  /* =========================================
     SEARCH
  ========================================= */

  const search = typeof params.search === "string" ? params.search.trim() : "";

  /* =========================================
     SORT
  ========================================= */

  const sort =
    typeof params.sort === "string" &&
    (ALLOWED_SORTS as readonly string[]).includes(params.sort)
      ? params.sort
      : "createdAt";

  /* =========================================
     ORDER
  ========================================= */

  const order: Prisma.SortOrder = params.order === "asc" ? "asc" : "desc";

  /* =========================================
     WHERE
  ========================================= */

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            role: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  /* =========================================
     ORDER BY
  ========================================= */

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sort === "name"
      ? { name: order }
      : sort === "email"
        ? { email: order }
        : sort === "role"
          ? { role: order }
          : sort === "isActive"
            ? { isActive: order }
            : { createdAt: order };

  /* =========================================
     TOTAL
  ========================================= */

  const total = await prisma.user.count({
    where,
  });

  /* =========================================
     TOTAL PAGES
  ========================================= */

  const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

  /* =========================================
     CURRENT PAGE
  ========================================= */

  const currentPage = Math.min(page, totalPages);

  /* =========================================
     USERS
  ========================================= */

  const users = await prisma.user.findMany({
    where,

    orderBy,

    skip: (currentPage - 1) * limit,

    take: limit,

    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="min-h-screen">
      {/* =====================================
          HEADER
      ====================================== */}

      <Header title="Users" breadcrumb={["Admin", "Users"]} />

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ===================================
            PAGE TITLE
        ==================================== */}

        <div className="mb-6">
          <Heading className="text-xl font-semibold">Users</Heading>

          <Text className="mt-1 text-sm text-muted-foreground">
            Manage user roles and account status.
          </Text>
        </div>

        {/* ===================================
            USER TABLE
        ==================================== */}

        <UserTable
          users={users}
          total={total}
          page={currentPage}
          totalPages={totalPages}
          limit={limit}
          search={search}
          sort={sort}
          order={order}
          allowedLimits={ALLOWED_LIMITS}
        />
      </div>
    </div>
  );
}
