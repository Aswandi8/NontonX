import * as React from "react";

import { cn } from "@/lib/utils";

type LabelProps = React.ComponentProps<"label">;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={cn("text-sm font-medium text-label", className)}
    >
      {children}
    </label>
  );
}
