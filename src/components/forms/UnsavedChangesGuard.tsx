"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";

interface UnsavedChangesGuardProps {
  isDirty: boolean;
  onClean?: () => void;
}

export default function UnsavedChangesGuard({
  isDirty,
  onClean,
}: UnsavedChangesGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  /* =========================================
     BROWSER REFRESH / CLOSE TAB
  ========================================= */

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  /* =========================================
     INTERNAL LINK PROTECTION
  ========================================= */

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;

      const link = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      /*
       * Jangan intercept link yang membuka
       * tab baru.
       */

      if (link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href) {
        return;
      }

      /*
       * Ignore special links.
       */

      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const url = new URL(href, window.location.origin);

      /*
       * External website.
       */

      if (url.origin !== window.location.origin) {
        return;
      }

      /*
       * Same page.
       */

      if (
        url.pathname === pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash
      ) {
        return;
      }

      /*
       * Stop navigation.
       */

      event.preventDefault();
      event.stopPropagation();

      setPendingUrl(`${url.pathname}${url.search}${url.hash}`);

      setIsOpen(true);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [isDirty, pathname]);

  /* =========================================
     REQUEST NAVIGATION
  ========================================= */

  const requestNavigation = useCallback(
    (url: string) => {
      if (!isDirty) {
        router.push(url);
        return;
      }

      setPendingUrl(url);
      setIsOpen(true);
    },
    [isDirty, router],
  );

  /* =========================================
     CUSTOM NAVIGATION EVENT
  ========================================= */

  useEffect(() => {
    const navigationHandler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        url: string;
      }>;

      const url = customEvent.detail?.url;

      if (!url) {
        return;
      }

      requestNavigation(url);
    };

    window.addEventListener("nontonx:navigation", navigationHandler);

    return () => {
      window.removeEventListener("nontonx:navigation", navigationHandler);
    };
  }, [requestNavigation]);

  /* =========================================
     CONFIRM LEAVE
  ========================================= */

  const handleConfirm = () => {
    const url = pendingUrl;

    setIsOpen(false);
    setPendingUrl(null);

    onClean?.();

    if (url) {
      router.push(url);
    }
  };

  /* =========================================
     CANCEL LEAVE
  ========================================= */

  const handleCancel = () => {
    setIsOpen(false);
    setPendingUrl(null);
  };

  /* =========================================
     RENDER
  ========================================= */

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-changes-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="unsaved-changes-title"
              className="text-base font-semibold text-foreground"
            >
              Unsaved Changes
            </h2>

            <Text className="mt-1 text-xs text-muted-foreground">
              Changes have not been saved
            </Text>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* =====================================
            CONTENT
        ====================================== */}

        <div className="px-5 py-6">
          <Text className="text-sm leading-6 text-foreground">
            You have unsaved changes. Are you sure you want to leave this page?
          </Text>

          <Text className="mt-2 text-sm text-muted-foreground">
            Your changes will be lost if you leave without saving.
          </Text>
        </div>

        {/* =====================================
            FOOTER
        ====================================== */}

        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Stay on Page
          </Button>

          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Leave Without Saving
          </Button>
        </div>
      </div>
    </div>
  );
}
