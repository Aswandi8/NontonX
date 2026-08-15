import * as React from "react";

import { cn } from "@/lib/utils";

/* =========================================
   VIDEO PROPS
========================================= */

export interface VideoProps extends React.ComponentProps<"video"> {
  className?: string;
}

/* =========================================
   VIDEO COMPONENT
========================================= */

export function Video({
  className,
  controls = true,
  preload = "metadata",
  playsInline = true,
  ...props
}: VideoProps) {
  return (
    <video
      data-slot="video"
      controls={controls}
      preload={preload}
      playsInline={playsInline}
      className={cn(
        "block h-auto w-full overflow-hidden rounded-xl object-cover",
        className,
      )}
      {...props}
    />
  );
}
