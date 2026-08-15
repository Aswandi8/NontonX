"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { deleteVideo } from "@/app/(protected)/(admin)/videos/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoActionsProps {
  videoId: string;
  videoTitle: string;
}

export default function VideoActions({
  videoId,
  videoTitle,
}: VideoActionsProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${videoTitle}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const result = await deleteVideo({
        videoId,
      });

      if (!result.success) {
        toast.error(result.error ?? "Unable to delete video.");

        return;
      }

      toast.success(result.message ?? "Video deleted successfully.");

      router.refresh();
    } catch (error) {
      console.error("Delete video error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* =====================================
          EDIT
      ====================================== */}

      <Link
        href={`/videos/${videoId}/edit`}
        aria-label={`Edit ${videoTitle}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          isDeleting && "pointer-events-none opacity-50",
        )}
      >
        <Pencil className="size-3.5" />
        Edit
      </Link>

      {/* =====================================
          DELETE
      ====================================== */}

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-disabled={isDeleting}
      >
        <Trash2 className="size-3.5" />

        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
