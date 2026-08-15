import { cn } from "@/lib/utils";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export function Title({ children, className }: TitleProps) {
  return (
    <h2
      className={cn("text-2xl font-bold tracking-tight text-title", className)}
    >
      {children}
    </h2>
  );
}
