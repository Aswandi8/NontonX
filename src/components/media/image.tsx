import NextImage, { type ImageProps as NextImageProps } from "next/image";

import { cn } from "@/lib/utils";

export interface ImageProps extends NextImageProps {
  className?: string;
}

/* =========================================
   NORMALIZE SOURCE
========================================= */

function normalizeSrc(src: ImageProps["src"]) {
  if (typeof src !== "string") {
    return src;
  }

  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  return `/${src}`;
}

/* =========================================
   IMAGE
========================================= */

export function Image({ src, className, quality = 75, ...props }: ImageProps) {
  return (
    <NextImage
      src={normalizeSrc(src)}
      quality={quality}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
