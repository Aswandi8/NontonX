"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Text } from "@/components/typography";
import { authClient } from "@/lib/auth-client";

import { useSidebar } from "./SidebarProvider";

export default function SidebarLogout() {
  const router = useRouter();
  const { closeDesktop, closeMobile } = useSidebar();

  const handleLogout = async () => {
    try {
      const { error } = await authClient.revokeSessions();

      if (error) {
        console.error("Logout error:", error);
        toast.error(error.message || "Unable to logout.");
        return;
      }

      closeDesktop();
      closeMobile();

      toast.success("You have been logged out.");

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    }
  };

  return (
    <div className="shrink-0 border-t border-border p-4">
      <button
        type="button"
        onClick={handleLogout}
        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />

        <Text className="text-sm font-medium text-current">Logout</Text>
      </button>
    </div>
  );
}
