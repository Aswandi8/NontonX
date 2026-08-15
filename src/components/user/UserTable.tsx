"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { Image } from "@/components/media";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import { Text } from "@/components/typography";
import UserDeleteButton from "@/components/user/UserDeleteButton";
import UserRoleButton from "@/components/user/UserRoleButton";
import UserStatusButton from "@/components/user/UserStatusButton";

/* =========================================
   TYPES
========================================= */

interface UserTableItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

interface UserTableProps {
  users: UserTableItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  allowedLimits: number[];
}

type SortField = "name" | "email" | "role" | "isActive" | "createdAt";

/* =========================================
   COMPONENT
========================================= */

export default function UserTable({
  users,
  total,
  page,
  totalPages,
  limit,
  search,
  sort,
  order,
  allowedLimits,
}: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* =========================================
     SEARCH STATE
  ========================================= */

  const [searchValue, setSearchValue] = useState(search);

  /* =========================================
     SYNC SEARCH INPUT
  ========================================= */

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";

    if (currentSearch !== searchValue && currentSearch === search) {
      return;
    }
  }, [search, searchParams, searchValue]);

  /* =========================================
     REALTIME SEARCH
  ========================================= */

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";

    const value = searchValue.trim();

    if (value === currentSearch) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

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

    return () => {
      clearTimeout(timer);
    };
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
     DATA RANGE
  ========================================= */

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  /* =========================================
     AVATAR INITIALS
  ========================================= */

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return "?";
    }

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0,
    )}`.toUpperCase();
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="space-y-4">
      {/* =====================================
          TOP BAR
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* TOTAL */}

        <Text className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> users
        </Text>

        {/* SEARCH */}

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search users..."
            aria-label="Search users"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* =====================================
          TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {users.length === 0 ? (
          /* ===================================
             EMPTY STATE
          ==================================== */

          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <Text className="font-medium">No users found</Text>

            <Text className="mt-1 text-sm text-muted-foreground">
              {search
                ? `No users match "${search}".`
                : "There are no users yet."}
            </Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              {/* =================================
                  TABLE HEADER
              ================================== */}

              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {/* USER */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("name")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      User
                      {getSortIcon("name")}
                    </button>
                  </th>

                  {/* EMAIL */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("email")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Email
                      {getSortIcon("email")}
                    </button>
                  </th>

                  {/* ROLE */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("role")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Role
                      {getSortIcon("role")}
                    </button>
                  </th>

                  {/* STATUS */}

                  <th className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort("isActive")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Status
                      {getSortIcon("isActive")}
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors duration-200 hover:bg-muted/30"
                  >
                    {/* =================================
                        USER
                    ================================== */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* AVATAR */}

                        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                          <Image
                            src={
                              user.image && user.image !== "default.jpg"
                                ? user.image
                                : "/default.jpg"
                            }
                            alt={user.name}
                            width={36}
                            height={36}
                            className="size-9 object-cover"
                          />
                        </div>

                        {/* NAME */}

                        <div className="min-w-0">
                          <Text className="truncate font-medium">
                            {user.name}
                          </Text>

                          <Text className="mt-0.5 text-xs text-muted-foreground">
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Text>
                        </div>
                      </div>
                    </td>

                    {/* =================================
                        EMAIL
                    ================================== */}

                    <td className="px-5 py-4">
                      <Text className="text-sm text-muted-foreground">
                        {user.email}
                      </Text>
                    </td>

                    {/* =================================
                        ROLE
                    ================================== */}

                    <td className="px-5 py-4">
                      <UserRoleButton
                        userId={user.id}
                        userName={user.name}
                        currentRole={user.role}
                      />
                    </td>

                    {/* =================================
                        STATUS
                    ================================== */}

                    <td className="px-5 py-4">
                      <UserStatusButton
                        userId={user.id}
                        userName={user.name}
                        isActive={user.isActive}
                      />
                    </td>

                    {/* =================================
                        CREATED
                    ================================== */}

                    <td className="px-5 py-4">
                      <Text className="whitespace-nowrap text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(user.createdAt)}
                      </Text>
                    </td>

                    {/* =================================
                        ACTIONS
                    ================================== */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <UserDeleteButton
                          userId={user.id}
                          userName={user.name}
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
        {/* ===================================
            ROWS PER PAGE
        ==================================== */}

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

        {/* ===================================
            PAGINATION
        ==================================== */}

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
                    className={`flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      item === page
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
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
