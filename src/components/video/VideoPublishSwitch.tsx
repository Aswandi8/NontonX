"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { toggleVideoPublished } from "@/app/(protected)/(admin)/videos/actions";
import { Title } from "@/components/typography";
import { cn } from "@/lib/utils";

interface VideoPublishSwitchProps {
  videoId: string;
  videoTitle: string;
  isPublished: boolean;
}

export default function VideoPublishSwitch({
  videoId,
  videoTitle,
  isPublished,
}: VideoPublishSwitchProps) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);

      const result = await toggleVideoPublished({
        videoId,
      });

      if (!result.success) {
        toast.error(result.error ?? "Unable to update video status.");

        return;
      }

      toast.success(result.message ?? "Video status updated.");

      router.refresh();
    } catch (error) {
      console.error("Toggle video status error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* =====================================
          SWITCH
      ====================================== */}

      <button
        type="button"
        role="switch"
        aria-checked={isPublished}
        aria-label={
          isPublished ? `Unpublish ${videoTitle}` : `Publish ${videoTitle}`
        }
        title={isPublished ? "Unpublish" : "Publish"}
        disabled={isUpdating}
        onClick={handleToggle}
        className={cn(
          "relative flex h-7 w-12 shrink-0 items-center rounded-full border border-border bg-background p-1 transition-colors duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          isPublished && "border-primary bg-primary",
        )}
      >
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full shadow-sm transition-transform duration-300",
            isPublished
              ? "translate-x-5 bg-primary-foreground text-primary"
              : "translate-x-0 bg-muted text-muted-foreground",
          )}
        >
          {isPublished ? (
            <Eye className="size-3" />
          ) : (
            <EyeOff className="size-3" />
          )}
        </span>
      </button>

      {/* =====================================
          STATUS TEXT
      ====================================== */}

      <Title
        className={cn(
          "whitespace-nowrap text-sm font-medium",
          isPublished ? "text-primary" : "text-muted-foreground",
        )}
      >
        {isUpdating ? "Updating..." : isPublished ? "Published" : "Draft"}
      </Title>
    </div>
  );
}
