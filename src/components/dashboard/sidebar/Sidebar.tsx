"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import SidebarAccountMenu from "./SidebarAccountMenu";
import SidebarLogo from "./SidebarLogo";
import SidebarLogout from "./SidebarLogout";
import SidebarMainMenu from "./SidebarMainMenu";
import SidebarUser from "./SidebarUser";
import { useSidebar } from "./SidebarProvider";

interface SidebarUserData {
  name: string;
  email: string;
  image?: string | null;
  role?: "USER" | "ADMIN" | null;
}

interface SidebarProps {
  user: SidebarUserData;
}

export default function Sidebar({ user }: SidebarProps) {
  const { desktopOpen, mobileOpen, closeDesktop, closeMobile } = useSidebar();

  const role = user.role === "ADMIN" ? "ADMIN" : "USER";

  const handleClose = () => {
    closeDesktop();
    closeMobile();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobile}
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-in-out lg:shadow-none",
          desktopOpen ? "lg:translate-x-0" : "lg:-translate-x-full",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative shrink-0 border-b border-border">
          <SidebarLogo />

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close sidebar"
            className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <SidebarUser user={user} />

          <div className="mt-6">
            <SidebarMainMenu role={role} />
          </div>

          <SidebarAccountMenu />
        </div>

        <SidebarLogout />
      </aside>
    </>
  );
}
