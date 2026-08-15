import {
  Bookmark,
  Folder,
  Heart,
  LayoutDashboard,
  PlaySquare,
  Users,
} from "lucide-react";

import { Label } from "@/components/typography";

import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarMainMenuProps {
  role: "USER" | "ADMIN";
}

export default function SidebarMainMenu({ role }: SidebarMainMenuProps) {
  return (
    <nav aria-label="Main navigation">
      <Label className="mb-3 block px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Main Menu
      </Label>

      <div className="space-y-1">
        <SidebarMenuItem
          title="Dashboard"
          href="/dashboard"
          icon={LayoutDashboard}
        />

        {role === "ADMIN" && (
          <>
            <SidebarMenuItem
              title="Videos"
              icon={PlaySquare}
              items={[
                { title: "All Videos", href: "/videos" },
                { title: "Add Video", href: "/videos/create" },
              ]}
            />

            <SidebarMenuItem
              title="Categories"
              icon={Folder}
              items={[
                { title: "All Categories", href: "/categories" },
                { title: "Add Category", href: "/categories/create" },
              ]}
            />

            <SidebarMenuItem title="Users" href="/users" icon={Users} />
          </>
        )}

        <SidebarMenuItem title="Favorites" href="/favorites" icon={Heart} />

        <SidebarMenuItem title="Watchlist" href="/watchlist" icon={Bookmark} />
      </div>
    </nav>
  );
}
