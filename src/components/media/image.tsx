import NextImage, { type ImageProps as NextImageProps } from "next/image";

import { cn } from "@/lib/utils";

export interface ImageProps extends NextImageProps {
  className?: string;
}

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

export function Image({
  src,
  className,
  width = 100,
  height = 100,
  loading = "lazy",
  quality = 75,
  ...props
}: ImageProps) {
  return (
    <NextImage
      src={normalizeSrc(src)}
      width={width}
      height={height}
      loading={loading}
      quality={quality}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
