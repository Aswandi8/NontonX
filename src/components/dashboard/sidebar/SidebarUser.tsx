import { UserCircle } from "lucide-react";

import { Image } from "@/components/media";
import { Link, Text } from "@/components/typography";
import { cn } from "@/lib/utils";

interface SidebarUserProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: "USER" | "ADMIN" | null;
  };
}

export default function SidebarUser({ user }: SidebarUserProps) {
  const name = user.name || "User";
  const email = user.email || "";
  const role = user.role === "ADMIN" ? "ADMIN" : "USER";

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <Link
      href="/profile"
      className="group flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3 transition-colors duration-200 hover:bg-muted"
    >
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {user.image ? (
          <Image
            src={user.image}
            alt={name}
            width={40}
            height={40}
            className="size-10 rounded-full"
          />
        ) : (
          initials || <UserCircle className="size-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Text className="truncate text-sm font-medium text-foreground">
          {name}
        </Text>

        <Text className="truncate text-xs text-muted-foreground">{email}</Text>

        <Text
          className={cn(
            "mt-1 text-[10px] font-semibold uppercase tracking-wider",
            role === "ADMIN" ? "text-primary" : "text-muted-foreground",
          )}
        >
          {role}
        </Text>
      </div>
    </Link>
  );
}
