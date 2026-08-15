"use client";

import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";

interface SidebarSubItem {
  title: string;
  href: string;
}

interface SidebarMenuItemProps {
  title: string;
  href?: string;
  icon: LucideIcon;
  items?: SidebarSubItem[];
}

export default function SidebarMenuItem({
  title,
  href,
  icon: Icon,
  items = [],
}: SidebarMenuItemProps) {
  const pathname = usePathname();
  const hasSubMenu = items.length > 0;

  const hasActiveSubItem = items.some((item) => pathname === item.href);

  const [isOpen, setIsOpen] = useState(hasActiveSubItem);

  if (!hasSubMenu) {
    const isActive =
      href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href ?? "#"}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-[18px] shrink-0",
            !isActive &&
              "transition-transform duration-200 group-hover:scale-105",
          )}
        />

        <Text className="truncate text-sm font-medium text-current">
          {title}
        </Text>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
          hasActiveSubItem
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className="size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105" />

        <Text className="flex-1 truncate text-left text-sm font-medium text-current">
          {title}
        </Text>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="relative ml-5 mt-1 space-y-1 border-l border-border pl-3">
            {items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center rounded-md px-3 py-2 transition-colors duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <span className="absolute -left-[13px] h-5 w-0.5 rounded-full bg-primary" />
                  )}

                  <Text className="truncate text-sm font-medium text-current">
                    {item.title}
                  </Text>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
