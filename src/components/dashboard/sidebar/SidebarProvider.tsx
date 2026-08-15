"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextValue {
  desktopOpen: boolean;
  mobileOpen: boolean;
  openDesktop: () => void;
  closeDesktop: () => void;
  toggleDesktop: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const value: SidebarContextValue = {
    desktopOpen,
    mobileOpen,
    openDesktop: () => setDesktopOpen(true),
    closeDesktop: () => setDesktopOpen(false),
    toggleDesktop: () => setDesktopOpen((value) => !value),
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
    toggleMobile: () => setMobileOpen((value) => !value),
  };

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={
          desktopOpen
            ? "min-h-screen transition-[padding] duration-300 ease-in-out lg:pl-64"
            : "min-h-screen transition-[padding] duration-300 ease-in-out lg:pl-0"
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  return context;
}
