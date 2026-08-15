"use client";

import { Menu } from "lucide-react";

import { Heading, Text } from "@/components/typography";
import { ModeToggle } from "@/components/theme/mode-toggle";

import { useSidebar } from "../sidebar/SidebarProvider";

interface DashboardHeaderProps {
  title: string;
  breadcrumb?: string[];
}

export default function DashboardHeader({
  title,
  breadcrumb = [],
}: DashboardHeaderProps) {
  const { desktopOpen, mobileOpen, openDesktop, openMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {!desktopOpen && (
            <button
              type="button"
              onClick={openDesktop}
              aria-label="Open sidebar"
              className="hidden size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground lg:flex"
            >
              <Menu className="size-5" />
            </button>
          )}

          {!mobileOpen && (
            <button
              type="button"
              onClick={openMobile}
              aria-label="Open sidebar"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          )}

          <div className="min-w-0">
            <Heading className="truncate text-lg font-semibold">
              {title}
            </Heading>

            {breadcrumb.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="mt-0.5 flex min-w-0 items-center gap-1.5 overflow-hidden"
              >
                {breadcrumb.map((item, index) => {
                  const isLast = index === breadcrumb.length - 1;

                  return (
                    <div
                      key={`${item}-${index}`}
                      className="flex min-w-0 items-center gap-1.5"
                    >
                      {index > 0 && (
                        <Text className="shrink-0 text-xs text-muted-foreground">
                          ›
                        </Text>
                      )}

                      <Text
                        className={
                          isLast
                            ? "truncate text-xs font-medium text-foreground"
                            : "truncate text-xs text-muted-foreground"
                        }
                      >
                        {item}
                      </Text>
                    </div>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
