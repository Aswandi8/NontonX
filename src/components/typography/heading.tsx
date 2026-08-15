import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading({ children, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-2xl font-bold tracking-tight text-heading md:text-4xl lg:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
