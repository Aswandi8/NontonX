import NextLink from "next/link";

import { cn } from "@/lib/utils";

interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export function Link({ children, href, className, target, rel }: LinkProps) {
  return (
    <NextLink
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "text-sm font-medium text-link no-underline transition-colors duration-200 hover:text-primary hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </NextLink>
  );
}
