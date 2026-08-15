import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export function Text({ children, className }: TextProps) {
  return (
    <p className={cn("text-base leading-7 text-text", className)}>{children}</p>
  );
}
