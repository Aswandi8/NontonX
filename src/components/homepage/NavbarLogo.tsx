"use client";

import Link from "next/link";

import { Image } from "@/components/media";
import { useTheme } from "@/components/theme/theme-provider";

export default function NavbarLogo() {
  const { theme } = useTheme();

  const logo = theme === "dark" ? "/dark-logo.png" : "/light-logo.png";

  return (
    <Link
      href="/"
      aria-label="NontonX Home"
      className="relative block h-10 w-32 shrink-0"
    >
      <Image
        src={logo}
        alt="NontonX"
        fill
        priority
        sizes="128px"
        className="object-contain object-left"
      />
    </Link>
  );
}
