import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-lg border bg-input-background px-4 py-2.5 text-sm text-input-text placeholder:text-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-focus transition-colors duration-200",
        "border-input-border",
        "aria-invalid:border-destructive",
        "aria-invalid:focus:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
