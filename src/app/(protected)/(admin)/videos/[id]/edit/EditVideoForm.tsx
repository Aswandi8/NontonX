"use client";

import * as React from "react";

import { ArrowLeft, Check, Save } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import toast from "react-hot-toast";

import VideoReview from "@/components/video/VideoReview";

import { Heading, Label, Text } from "@/components/typography";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { updateVideo, type UpdateVideoInput } from "../../actions";

/* =========================================
   TYPES
========================================= */

interface Category {
  id: string;
  name: string;
}

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  videoUrl: string;
  duration: number | null;
  isPublished: boolean;

  categories: {
    id: string;
    name: string;
  }[];
}

interface EditVideoFormProps {
  video: VideoData;
  categories: Category[];
}

/* =========================================
   COMPONENT
========================================= */

export default function EditVideoForm({
  video,
  categories,
}: EditVideoFormProps) {
  const router = useRouter();

  /* =========================================
     BASIC INFORMATION
  ========================================= */

  const [title, setTitle] = useState(video.title);

  const [description, setDescription] = useState(video.description ?? "");

  /* =========================================
     MEDIA
  ========================================= */

  const [thumbnail, setThumbnail] = useState(video.thumbnail ?? "");

  const [videoUrl, setVideoUrl] = useState(video.videoUrl);

  /* =========================================
     DURATION
  ========================================= */

  const initialDuration = video.duration ?? 0;

  const initialHours = Math.floor(initialDuration / 3600);

  const initialMinutes = Math.floor((initialDuration % 3600) / 60);

  const initialSeconds = initialDuration % 60;

  const [hours, setHours] = useState(
    initialHours > 0 ? String(initialHours) : "",
  );

  const [minutes, setMinutes] = useState(
    initialMinutes > 0 ? String(initialMinutes) : "",
  );

  const [seconds, setSeconds] = useState(
    initialSeconds > 0 ? String(initialSeconds) : "",
  );

  /* =========================================
     CATEGORY
  ========================================= */

  const [categoryIds, setCategoryIds] = useState<string[]>(
    video.categories.map((category) => category.id),
  );

  /* =========================================
     PUBLISHING
  ========================================= */

  const [isPublished, setIsPublished] = useState(video.isPublished);

  /* =========================================
     SUBMIT
  ========================================= */

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================
     DURATION
  ========================================= */

  const parsedHours = hours === "" ? 0 : Number(hours);

  const parsedMinutes = minutes === "" ? 0 : Number(minutes);

  const parsedSeconds = seconds === "" ? 0 : Number(seconds);

  const totalDuration =
    Number.isInteger(parsedHours) &&
    Number.isInteger(parsedMinutes) &&
    Number.isInteger(parsedSeconds) &&
    parsedHours >= 0 &&
    parsedMinutes >= 0 &&
    parsedMinutes <= 59 &&
    parsedSeconds >= 0 &&
    parsedSeconds <= 59
      ? parsedHours * 3600 + parsedMinutes * 60 + parsedSeconds
      : 0;

  const duration = totalDuration > 0 ? totalDuration : null;

  /* =========================================
     SELECTED CATEGORIES
  ========================================= */

  const selectedCategories = categories
    .filter((category) => categoryIds.includes(category.id))
    .map((category) => category.name);

  /* =========================================
     CATEGORY TOGGLE
  ========================================= */

  const toggleCategory = (categoryId: string) => {
    setCategoryIds((current) => {
      if (current.includes(categoryId)) {
        return current.filter((id) => id !== categoryId);
      }

      return [...current, categoryId];
    });
  };

  /* =========================================
     DURATION INPUT
  ========================================= */

  const handleDurationChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (value === "") {
      setter("");

      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setter(value);
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    /* =======================================
       TITLE
    ======================================== */

    if (!title.trim()) {
      toast.error("Title is required.");

      return;
    }

    /* =======================================
       VIDEO URL
    ======================================== */

    if (!videoUrl.trim()) {
      toast.error("Video URL is required.");

      return;
    }

    try {
      new URL(videoUrl.trim());
    } catch {
      toast.error("Please enter a valid video URL.");

      return;
    }

    /* =======================================
       THUMBNAIL URL
    ======================================== */

    if (thumbnail.trim()) {
      try {
        new URL(thumbnail.trim());
      } catch {
        toast.error("Please enter a valid thumbnail URL.");

        return;
      }
    }

    /* =======================================
       DURATION VALIDATION
    ======================================== */

    if (!Number.isInteger(parsedHours) || parsedHours < 0) {
      toast.error("Hours must be a valid number.");

      return;
    }

    if (
      !Number.isInteger(parsedMinutes) ||
      parsedMinutes < 0 ||
      parsedMinutes > 59
    ) {
      toast.error("Minutes must be between 0 and 59.");

      return;
    }

    if (
      !Number.isInteger(parsedSeconds) ||
      parsedSeconds < 0 ||
      parsedSeconds > 59
    ) {
      toast.error("Seconds must be between 0 and 59.");

      return;
    }

    /* =======================================
       FORM DATA
    ======================================== */

    const data: UpdateVideoInput = {
      videoId: video.id,

      title: title.trim(),

      description: description.trim() || undefined,

      thumbnail: thumbnail.trim() || "",

      videoUrl: videoUrl.trim(),

      duration,

      categoryIds,

      isPublished,
    };

    /* =======================================
       UPDATE
    ======================================== */

    try {
      setIsSubmitting(true);

      const result = await updateVideo(data);

      if (!result.success) {
        toast.error(result.error ?? "Unable to update video.");

        return;
      }

      toast.success(result.message ?? "Video updated successfully.");

      router.push("/videos");
      router.refresh();
    } catch (error) {
      console.error("Update video error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* =====================================
          LEFT — FORM
      ====================================== */}

      <div className="min-w-0">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* =================================
              BASIC INFORMATION
          ================================== */}

          <section className="space-y-6">
            <div>
              <Heading className="text-base font-semibold">
                Basic Information
              </Heading>

              <Text className="mt-1 text-sm text-muted-foreground">
                Update the basic information for this video.
              </Text>
            </div>

            {/* TITLE */}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter video title"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter video description"
                rows={6}
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* =================================
              MEDIA
          ================================== */}

          <section className="space-y-6 border-t border-border pt-8">
            <div>
              <Heading className="text-base font-semibold">Media</Heading>

              <Text className="mt-1 text-sm text-muted-foreground">
                Update the thumbnail and video source.
              </Text>
            </div>

            {/* THUMBNAIL */}

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>

              <Input
                id="thumbnail"
                type="url"
                value={thumbnail}
                onChange={(event) => setThumbnail(event.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                autoComplete="off"
                disabled={isSubmitting}
              />

              <Text className="text-xs text-muted-foreground">
                Enter the thumbnail URL.
              </Text>
            </div>

            {/* VIDEO URL */}

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>

              <Input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://example.com/video.mp4"
                autoComplete="off"
                disabled={isSubmitting}
              />

              <Text className="text-xs text-muted-foreground">
                Enter the direct URL of the video.
              </Text>
            </div>

            {/* DURATION */}

            <div className="space-y-2">
              <Label>Duration</Label>

              <div className="grid grid-cols-3 gap-3">
                {/* HOURS */}

                <div className="space-y-2">
                  <Text className="text-xs text-muted-foreground">Hours</Text>

                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={hours}
                    onChange={(event) =>
                      handleDurationChange(event.target.value, setHours)
                    }
                    placeholder="00"
                    disabled={isSubmitting}
                  />
                </div>

                {/* MINUTES */}

                <div className="space-y-2">
                  <Text className="text-xs text-muted-foreground">Minutes</Text>

                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    value={minutes}
                    onChange={(event) =>
                      handleDurationChange(event.target.value, setMinutes)
                    }
                    placeholder="00"
                    disabled={isSubmitting}
                  />
                </div>

                {/* SECONDS */}

                <div className="space-y-2">
                  <Text className="text-xs text-muted-foreground">Seconds</Text>

                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    value={seconds}
                    onChange={(event) =>
                      handleDurationChange(event.target.value, setSeconds)
                    }
                    placeholder="00"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Text className="text-xs text-muted-foreground">
                Example: 01 : 25 : 30 means 1 hour, 25 minutes, and 30 seconds.
              </Text>
            </div>
          </section>

          {/* =================================
              CATEGORIES
          ================================== */}

          <section className="space-y-6 border-t border-border pt-8">
            <div>
              <Heading className="text-base font-semibold">Categories</Heading>

              <Text className="mt-1 text-sm text-muted-foreground">
                Select one or more categories for this video.
              </Text>
            </div>

            {categories.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((category) => {
                  const selected = categoryIds.includes(category.id);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      disabled={isSubmitting}
                      aria-pressed={selected}
                      className={[
                        "flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                        "disabled:pointer-events-none disabled:opacity-50",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex size-5 shrink-0 items-center justify-center rounded-md border",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border",
                        ].join(" ")}
                      >
                        {selected && <Check className="size-3.5" />}
                      </span>

                      <Text className="text-current">{category.name}</Text>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <Text className="text-sm text-muted-foreground">
                  No categories available. Create a category first.
                </Text>
              </div>
            )}

            {categoryIds.length > 0 && (
              <Text className="text-xs text-muted-foreground">
                {categoryIds.length}{" "}
                {categoryIds.length === 1 ? "category" : "categories"} selected.
              </Text>
            )}
          </section>

          {/* =================================
              PUBLISHING
          ================================== */}

          <section className="space-y-6 border-t border-border pt-8">
            <div>
              <Heading className="text-base font-semibold">Publishing</Heading>

              <Text className="mt-1 text-sm text-muted-foreground">
                Choose whether this video should be visible to users.
              </Text>
            </div>

            <button
              type="button"
              onClick={() => setIsPublished((current) => !current)}
              disabled={isSubmitting}
              aria-pressed={isPublished}
              className={[
                "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                "disabled:pointer-events-none disabled:opacity-50",
                isPublished
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:bg-muted",
              ].join(" ")}
            >
              <span
                className={[
                  "flex size-5 shrink-0 items-center justify-center rounded-md border",
                  isPublished
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border",
                ].join(" ")}
              >
                {isPublished && <Check className="size-3.5" />}
              </span>

              <div>
                <Text className="text-sm font-medium">
                  {isPublished ? "Published" : "Save as Draft"}
                </Text>

                <Text className="mt-1 text-xs text-muted-foreground">
                  {isPublished
                    ? "This video will be visible to users."
                    : "This video will remain hidden until published."}
                </Text>
              </div>
            </button>
          </section>

          {/* =================================
              ACTIONS
          ================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            {/* CANCEL */}

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/videos")}
              disabled={isSubmitting}
            >
              <ArrowLeft />
              Cancel
            </Button>

            {/* SAVE */}

            <Button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              <Save />

              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* =====================================
          RIGHT — REVIEW
      ====================================== */}

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-5">
            <Heading className="text-base font-semibold">Review</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Preview the changes before saving this video.
            </Text>
          </div>

          <VideoReview
            title={title}
            description={description}
            videoUrl={videoUrl}
            thumbnail={thumbnail}
            duration={duration}
            categories={selectedCategories}
            isPublished={isPublished}
          />
        </div>
      </div>
    </div>
  );
}
