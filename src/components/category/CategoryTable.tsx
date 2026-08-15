"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Pencil,
  Search,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Text } from "@/components/typography";
import CategoryDeleteButton from "@/components/category/CategoryDeleteButton";

/* =========================================
   TYPES
========================================= */

interface CategoryTableItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  _count: {
    videos: number;
  };
}

interface CategoryTableProps {
  categories: CategoryTableItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  allowedLimits: number[];
}

type SortField = "name" | "slug" | "videos" | "createdAt";

/* =========================================
   COMPONENT
========================================= */

export default function CategoryTable({
  categories,
  total,
  page,
  totalPages,
  limit,
  search,
  sort,
  order,
  allowedLimits,
}: CategoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* =========================================
     SEARCH STATE
  ========================================= */

  const [searchValue, setSearchValue] = useState(search);

  /* =========================================
     REALTIME SEARCH
     DEBOUNCE 300ms
  ========================================= */

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    if (searchValue.trim() === currentSearch) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const value = searchValue.trim();

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      // Reset ke halaman pertama
      // ketika search berubah.
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, pathname, router]);

  /* =========================================
     UPDATE QUERY
  ========================================= */

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  /* =========================================
     SORT
  ========================================= */

  const handleSort = (field: SortField) => {
    const nextOrder = sort === field && order === "asc" ? "desc" : "asc";

    updateQuery({
      sort: field,
      order: nextOrder,
      page: "1",
    });
  };

  /* =========================================
     LIMIT
  ========================================= */

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuery({
      limit: event.target.value,
      page: "1",
    });
  };

  /* =========================================
     PAGE URL
  ========================================= */

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(pageNumber));

    return `${pathname}?${params.toString()}`;
  };

  /* =========================================
     SORT ICON
  ========================================= */

  const getSortIcon = (field: SortField) => {
    if (sort !== field) {
      return <ChevronsUpDown className="size-3.5" />;
    }

    return order === "asc" ? (
      <ChevronUp className="size-3.5" />
    ) : (
      <ChevronDown className="size-3.5" />
    );
  };

  /* =========================================
     DATA RANGE
  ========================================= */

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  /* =========================================
     PAGINATION
  ========================================= */

  const getPaginationPages = () => {
    /*
     * Jika halaman sedikit,
     * tampilkan semuanya.
     *
     * 1 2 3 4 5
     */

    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    /*
     * Halaman awal
     *
     * 1 2 3 4 5 ... 20
     */

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
    }

    /*
     * Halaman akhir
     *
     * 1 ... 16 17 18 19 20
     */

    if (page >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ] as const;
    }

    /*
     * Halaman tengah
     *
     * 1 ... 9 10 11 ... 20
     */

    return [
      1,
      "ellipsis",
      page - 1,
      page,
      page + 1,
      "ellipsis",
      totalPages,
    ] as const;
  };

  const paginationPages = getPaginationPages();

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="space-y-4">
      {/* =====================================
          TOP BAR
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* TOTAL DATA */}

        <Text className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span>{" "}
          categories
        </Text>

        {/* SEARCH */}

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search category..."
            aria-label="Search category"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* =====================================
          TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {categories.length === 0 ? (
          /* ===================================
             EMPTY STATE
          ==================================== */

          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <Text className="font-medium">No categories found</Text>

            <Text className="mt-1 text-sm text-muted-foreground">
              {search
                ? `No categories match "${search}".`
                : "You have not created any categories yet."}
            </Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              {/* =================================
                  TABLE HEADER
              ================================== */}

              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {/* CATEGORY */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("name")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Category
                      {getSortIcon("name")}
                    </button>
                  </th>

                  {/* SLUG */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("slug")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Slug
                      {getSortIcon("slug")}
                    </button>
                  </th>

                  {/* DESCRIPTION */}

                  <th className="px-5 py-3 text-left">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </span>
                  </th>

                  {/* VIDEOS */}

                  <th className="px-5 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleSort("videos")}
                      className="mx-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Videos
                      {getSortIcon("videos")}
                    </button>
                  </th>

                  {/* CREATED */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Created
                      {getSortIcon("createdAt")}
                    </button>
                  </th>

                  {/* ACTIONS */}

                  <th className="px-5 py-3 text-right">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              {/* =================================
                  TABLE BODY
              ================================== */}

              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors duration-200 hover:bg-muted/30"
                  >
                    {/* CATEGORY */}

                    <td className="px-5 py-4">
                      <div className="min-w-0">
                        <Text className="truncate font-medium">
                          {category.name}
                        </Text>

                        <Text className="mt-1 truncate text-xs text-muted-foreground">
                          /{category.slug}
                        </Text>
                      </div>
                    </td>

                    {/* SLUG */}

                    <td className="px-5 py-4">
                      <Text className="text-sm text-muted-foreground">
                        {category.slug}
                      </Text>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="max-w-[280px] px-5 py-4">
                      {category.description ? (
                        <Text className="line-clamp-2 text-sm text-muted-foreground">
                          {category.description}
                        </Text>
                      ) : (
                        <Text className="text-sm text-muted-foreground/50">
                          No description
                        </Text>
                      )}
                    </td>

                    {/* VIDEOS */}

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                        {category._count.videos}
                      </span>
                    </td>

                    {/* CREATED */}

                    <td className="px-5 py-4">
                      <Text className="whitespace-nowrap text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(category.createdAt)}
                      </Text>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* EDIT */}

                        <Link
                          href={`/categories/${category.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Link>

                        {/* DELETE */}

                        <CategoryDeleteButton
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================
          BOTTOM BAR
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ROWS PER PAGE */}

        <div className="flex items-center gap-2">
          <Text className="text-sm text-muted-foreground">Rows per page</Text>

          <select
            value={limit}
            onChange={handleLimitChange}
            aria-label="Rows per page"
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {allowedLimits.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* PREVIOUS */}

            {page > 1 ? (
              <Link
                href={getPageUrl(page - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft className="size-4" />

                <span className="hidden sm:inline">Previous</span>
              </Link>
            ) : (
              <span className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground/30">
                <ChevronLeft className="size-4" />

                <span className="hidden sm:inline">Previous</span>
              </span>
            )}

            {/* PAGE NUMBERS */}

            <div className="flex items-center gap-1">
              {paginationPages.map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex size-9 items-center justify-center text-sm text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={getPageUrl(item)}
                    className={`flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      item === page
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>

            {/* NEXT */}

            {page < totalPages ? (
              <Link
                href={getPageUrl(page + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="hidden sm:inline">Next</span>

                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground/30">
                <span className="hidden sm:inline">Next</span>

                <ChevronRight className="size-4" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
