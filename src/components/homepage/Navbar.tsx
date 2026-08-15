"use client";

import Link from "next/link";
import { Menu, Search, Send, X } from "lucide-react";
import { useState } from "react";

import { ModeToggle } from "@/components/theme/mode-toggle";

import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden border-b border-border bg-background/95 backdrop-blur">
      {/* =====================================
          NAVBAR CONTAINER
      ====================================== */}

      <div className="mx-auto flex h-16 w-full max-w-[1600px] min-w-0 items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        {/* ===================================
            LOGO
        ==================================== */}

        <NavbarLogo />

        {/* ===================================
            DESKTOP NAVIGATION
        ==================================== */}

        <nav className="hidden shrink-0 items-center gap-8 md:flex">
          {/* HOME */}

          <Link
            href="/"
            className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary"
          >
            Home
          </Link>

          {/* CATEGORIES */}

          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Categories
          </Link>

          {/* LATEST */}

          <Link
            href="/latest"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Latest
          </Link>
        </nav>

        {/* ===================================
            DESKTOP RIGHT ACTIONS
        ==================================== */}

        <div className="ml-auto hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex">
          {/* =================================
              SEARCH
          ================================== */}

          <div className="relative min-w-0 w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              placeholder="Search videos..."
              aria-label="Search videos"
              className="h-10 w-full min-w-0 rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* =================================
              TELEGRAM
          ================================== */}

          <a
            href="https://t.me/NontonX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Send className="size-4" />

            <span>Join Telegram</span>
          </a>

          {/* =================================
              DARK / LIGHT
          ================================== */}

          <ModeToggle />
        </div>

        {/* ===================================
            MOBILE ACTIONS
        ==================================== */}

        <div className="ml-auto flex shrink-0 items-center gap-2 md:hidden">
          {/* DARK / LIGHT */}

          <ModeToggle />

          {/* MENU */}

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* =====================================
          MOBILE MENU
      ====================================== */}

      {isMenuOpen && (
        <div className="w-full border-t border-border md:hidden">
          <nav className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 px-4 py-3 sm:px-6">
            {/* =================================
                SEARCH
            ================================== */}

            <div className="mb-2 w-full">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  placeholder="Search videos..."
                  aria-label="Search videos"
                  className="h-10 w-full min-w-0 rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* =================================
                HOME
            ================================== */}

            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
            >
              Home
            </Link>

            {/* =================================
                CATEGORIES
            ================================== */}

            <Link
              href="/categories"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              Categories
            </Link>

            {/* =================================
                LATEST
            ================================== */}

            <Link
              href="/latest"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              Latest
            </Link>

            {/* =================================
                TELEGRAM
            ================================== */}

            <a
              href="https://t.me/NontonX"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              <Send className="size-4" />
              Join Telegram
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
