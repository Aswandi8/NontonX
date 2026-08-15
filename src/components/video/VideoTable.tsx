"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
} from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import { Image } from "@/components/media";
import { Text, Title } from "@/components/typography";
import VideoActions from "@/components/video/VideoActions";
import VideoPublishSwitch from "@/components/video/VideoPublishSwitch";

interface VideoTableItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  videoUrl: string;
  duration: number | null;
  isPublished: boolean;
  createdAt: Date;

  categories: {
    id: string;
    name: string;
  }[];
}

interface VideoTableProps {
  videos: VideoTableItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  allowedLimits: number[];
}

type SortField = "title" | "slug" | "duration" | "isPublished" | "createdAt";

export default function VideoTable({
  videos,
  total,
  page,
  totalPages,
  limit,
  search,
  sort,
  order,
  allowedLimits,
}: VideoTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* =========================================
     SEARCH STATE
  ========================================= */

  const [searchValue, setSearchValue] = useState(search);

  /* =========================================
     SEARCH DEBOUNCE
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
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
    }

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
        <Text className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> videos
        </Text>

        {/* SEARCH */}

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search video..."
            aria-label="Search video"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* =====================================
          TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {videos.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <Text className="font-medium">No videos found</Text>

            <Text className="mt-1 text-sm text-muted-foreground">
              {search
                ? `No videos match "${search}".`
                : "You have not created any videos yet."}
            </Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              {/* =================================
                  HEADER
              ================================== */}

              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {/* VIDEO */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("title")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Video
                      {getSortIcon("title")}
                    </button>
                  </th>

                  {/* DURATION */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("duration")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Duration
                      {getSortIcon("duration")}
                    </button>
                  </th>

                  {/* STATUS */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("isPublished")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Status
                      {getSortIcon("isPublished")}
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
                  BODY
              ================================== */}

              <tbody className="divide-y divide-border">
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className="transition-colors duration-200 hover:bg-muted/30"
                  >
                    {/* VIDEO */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        {/* THUMBNAIL */}

                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                          {video.thumbnail ? (
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              width={64}
                              height={64}
                              className="size-16 rounded-lg object-cover"
                            />
                          ) : (
                            <Text className="text-[10px] text-muted-foreground">
                              No Image
                            </Text>
                          )}
                        </div>

                        {/* VIDEO INFORMATION */}

                        <div className="min-w-0">
                          {/* TITLE */}

                          <Text className="truncate font-medium">
                            {video.title}
                          </Text>

                          {/* DESCRIPTION */}

                          <Text className="mt-1 max-w-[420px] truncate text-xs text-muted-foreground">
                            {video.description || "No description"}
                          </Text>

                          {/* CATEGORY */}

                          {video.categories.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {video.categories.map((category) => (
                                <span
                                  key={category.id}
                                  className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                                >
                                  {category.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <Text className="mt-2 text-xs text-muted-foreground/50">
                              No category
                            </Text>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* DURATION */}

                    <td className="px-5 py-4">
                      <Text className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDuration(video.duration)}
                      </Text>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <VideoPublishSwitch
                        videoId={video.id}
                        videoTitle={video.title}
                        isPublished={video.isPublished}
                      />
                    </td>

                    {/* CREATED */}

                    <td className="px-5 py-4">
                      <Text className="whitespace-nowrap text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(video.createdAt)}
                      </Text>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <VideoActions
                        videoId={video.id}
                        videoTitle={video.title}
                      />
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
              <a
                href={getPageUrl(page - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft className="size-4" />

                <span className="hidden sm:inline">Previous</span>
              </a>
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
                  <a
                    key={item}
                    href={getPageUrl(item)}
                    className={
                      item === page
                        ? "flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-sm font-medium text-primary-foreground transition-colors"
                        : "flex size-9 items-center justify-center rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    }
                  >
                    {item}
                  </a>
                ),
              )}
            </div>

            {/* NEXT */}

            {page < totalPages ? (
              <a
                href={getPageUrl(page + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="hidden sm:inline">Next</span>

                <ChevronRight className="size-4" />
              </a>
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

/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(duration: number | null) {
  if (duration === null || duration < 0) {
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
