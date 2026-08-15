import { Play } from "lucide-react";
import { Title, Text } from "@/components/typography";

export default function SidebarLogo() {
  return (
    <div className="flex h-16 items-center px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Play className="size-4 fill-current" />
        </div>

        <div className="min-w-0">
          <Title className="truncate text-base font-bold leading-none tracking-tight">
            NontonX
          </Title>
          <Text className="mt-1 truncate text-[10px] leading-none text-muted-foreground">
            Video Platform
          </Text>
        </div>
      </div>
    </div>
  );
}
