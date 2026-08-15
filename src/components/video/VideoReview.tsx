"use client";

import { Clock3, Eye, Folder } from "lucide-react";

import { Video } from "@/components/media";
import { Heading, Text } from "@/components/typography";

interface VideoReviewProps {
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number | null;
  categories: string[];
  isPublished: boolean;
}

/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(duration: number | null) {
  if (duration === null || duration <= 0) {
    return "00:00";
  }

  const hours = Math.floor(duration / 3600);

  const minutes = Math.floor((duration % 3600) / 60);

  const seconds = duration % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

/* =========================================
   COMPONENT
========================================= */

export default function VideoReview({
  title,
  description,
  videoUrl,
  thumbnail,
  duration,
  categories,
  isPublished,
}: VideoReviewProps) {
  const hasVideo = videoUrl.trim().length > 0;

  const displayTitle = title.trim() || "Untitled Video";

  const displayDescription = description.trim() || "No description provided.";

  return (
    <div className="space-y-5">
      {/* =====================================
          VIDEO PREVIEW
      ====================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-black">
        {hasVideo ? (
          <Video
            src={videoUrl.trim()}
            poster={thumbnail.trim() || undefined}
            className="aspect-video rounded-none"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted">
            <Text className="text-sm text-muted-foreground">
              Video preview will appear here.
            </Text>
          </div>
        )}
      </div>

      {/* =====================================
          TITLE & DESCRIPTION
      ====================================== */}

      <div>
        <Heading className="text-xl font-semibold leading-tight">
          {displayTitle}
        </Heading>

        <Text className="mt-2 text-sm leading-6 text-muted-foreground">
          {displayDescription}
        </Text>
      </div>

      {/* =====================================
          VIDEO INFORMATION
      ====================================== */}

      <div className="grid gap-3 sm:grid-cols-3">
        {/* DURATION */}

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-primary" />

            <Text className="text-xs text-muted-foreground">Duration</Text>
          </div>

          <Text className="mt-2 text-sm font-medium">
            {formatDuration(duration)}
          </Text>
        </div>

        {/* CATEGORIES */}

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Folder className="size-4 text-primary" />

            <Text className="text-xs text-muted-foreground">Categories</Text>
          </div>

          <Text className="mt-2 truncate text-sm font-medium">
            {categories.length > 0 ? categories.join(", ") : "No category"}
          </Text>
        </div>

        {/* STATUS */}

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />

            <Text className="text-xs text-muted-foreground">Status</Text>
          </div>

          <Text className="mt-2 text-sm font-medium">
            {isPublished ? "Published" : "Draft"}
          </Text>
        </div>
      </div>
    </div>
  );
}
