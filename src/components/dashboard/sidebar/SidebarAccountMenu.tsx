import { Settings, UserCircle } from "lucide-react";

import { Label } from "@/components/typography";

import SidebarMenuItem from "./SidebarMenuItem";

export default function SidebarAccountMenu() {
  return (
    <nav aria-label="Account navigation" className="mt-7">
      <div className="mb-5 h-px bg-border" />

      <Label className="mb-3 block px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Account
      </Label>

      <div className="space-y-1">
        <SidebarMenuItem title="Profile" href="/profile" icon={UserCircle} />

        <SidebarMenuItem title="Settings" href="/settings" icon={Settings} />
      </div>
    </nav>
  );
}
