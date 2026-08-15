import type { LucideIcon } from "lucide-react";

import { Heading, Text } from "@/components/typography";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export default function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:bg-muted/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Text className="text-sm font-medium text-muted-foreground">
            {title}
          </Text>

          <Heading className="mt-2 text-2xl font-bold">{value}</Heading>

          <Text className="mt-1 text-xs text-muted-foreground">
            {description}
          </Text>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
