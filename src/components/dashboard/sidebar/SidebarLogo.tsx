"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme/theme-provider";

export default function SidebarLogo() {
  const { theme } = useTheme();

  const logo = theme === "dark" ? "/dark-logo.png" : "/light-logo.png";

  return (
    <div className="flex h-16 items-center justify-center px-4">
      <div className="relative h-13 w-100">
        <Image
          src={logo}
          alt="NontonX"
          fill
          priority
          className="object-contain object-center"
        />
      </div>
    </div>
  );
}
