"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { Label, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UnsavedChangesGuard from "@/components/forms/UnsavedChangesGuard";

import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/validations/category";

interface CategoryFormProps {
  mode?: "create" | "edit";

  defaultValues?: Partial<CategoryFormData>;

  onSubmitAction: (data: CategoryFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export default function CategoryForm({
  mode = "create",
  defaultValues,
  onSubmitAction,
}: CategoryFormProps) {
  const router = useRouter();

  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),

    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      image: defaultValues?.image ?? "",
    },
  });

  const isEdit = mode === "edit";

  /* =========================================
     CANCEL
  ========================================= */

  const handleCancel = () => {
    /*
     * Jika tidak ada perubahan,
     * langsung kembali.
     */

    if (!isEdit || !isDirty) {
      router.push("/categories");
      return;
    }

    /*
     * Jika ada perubahan,
     * tampilkan confirmation modal.
     */

    setShowCancelModal(true);
  };

  /* =========================================
     CONFIRM CANCEL
  ========================================= */

  const handleConfirmCancel = () => {
    setShowCancelModal(false);

    router.push("/categories");
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const result = await onSubmitAction(data);

      if (!result.success) {
        toast.error(
          result.error ?? `Unable to ${isEdit ? "update" : "create"} category.`,
        );

        return;
      }

      toast.success(
        isEdit
          ? "Category updated successfully!"
          : "Category created successfully!",
      );

      router.push("/categories");
      router.refresh();
    } catch (error) {
      console.error(`${isEdit ? "Update" : "Create"} category error:`, error);

      toast.error(
        `Something went wrong while ${
          isEdit ? "updating" : "creating"
        } the category.`,
      );
    }
  };

  return (
    <>
      {/* =====================================
          UNSAVED CHANGES GUARD
          Untuk Sidebar / Header / Link
      ====================================== */}

      <UnsavedChangesGuard isDirty={isEdit && isDirty} />

      {/* =====================================
          FORM
      ====================================== */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ===================================
            CATEGORY NAME
        ==================================== */}

        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>

          <Input
            id="name"
            type="text"
            placeholder="Anime"
            autoComplete="off"
            {...register("name")}
            aria-invalid={!!errors.name}
            disabled={isSubmitting}
          />

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* ===================================
            DESCRIPTION
        ==================================== */}

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>

          <textarea
            id="description"
            rows={4}
            placeholder="Kumpulan video anime..."
            {...register("description")}
            aria-invalid={!!errors.description}
            disabled={isSubmitting}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* ===================================
            IMAGE
        ==================================== */}

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>

          <Input
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            {...register("image")}
            aria-invalid={!!errors.image}
            disabled={isSubmitting}
          />

          {errors.image && (
            <p className="text-sm text-destructive">{errors.image.message}</p>
          )}

          <Text className="text-xs text-muted-foreground">
            Optional. Add an image URL for this category.
          </Text>
        </div>

        {/* ===================================
            ACTIONS
        ==================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Category"
                : "Create Category"}
          </Button>
        </div>
      </form>

      {/* =====================================
          CANCEL CONFIRMATION MODAL
      ====================================== */}

      {showCancelModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-category-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2
                  id="cancel-category-title"
                  className="text-base font-semibold text-foreground"
                >
                  Unsaved Changes
                </h2>

                <Text className="mt-1 text-xs text-muted-foreground">
                  Changes have not been saved
                </Text>
              </div>

              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* CONTENT */}

            <div className="px-5 py-6">
              <Text className="text-sm leading-6 text-foreground">
                You have unsaved changes. Are you sure you want to leave this
                page?
              </Text>

              <Text className="mt-2 text-sm text-muted-foreground">
                Your changes will be lost if you leave without saving.
              </Text>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Stay on Page
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmCancel}
              >
                Leave Without Saving
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
