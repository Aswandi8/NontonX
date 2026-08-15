"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";

import { deleteCategory } from "@/app/(protected)/(admin)/categories/delete/actions";

interface CategoryDeleteButtonProps {
  categoryId: string;
  categoryName: string;
}

export default function CategoryDeleteButton({
  categoryId,
  categoryName,
}: CategoryDeleteButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================================
     OPEN DELETE MODAL
  ========================================= */

  const handleOpen = () => {
    if (isDeleting) {
      return;
    }

    setIsOpen(true);
  };

  /* =========================================
     CLOSE DELETE MODAL
  ========================================= */

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setIsOpen(false);
  };

  /* =========================================
     DELETE CATEGORY
  ========================================= */

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteCategory(categoryId);

      /* =====================================
         ERROR
      ====================================== */

      if (!result.success) {
        toast.error(result.error ?? "Unable to delete category.");

        return;
      }

      /* =====================================
         SUCCESS
      ====================================== */

      toast.success("Category deleted successfully.");

      setIsOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Delete category error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* =====================================
          DELETE BUTTON
      ====================================== */}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        disabled={isDeleting}
        aria-disabled={isDeleting}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
        Delete
      </Button>

      {/* =====================================
          DELETE MODAL
      ====================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
        >
          {/* =================================
              MODAL CARD
          ================================== */}

          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* =================================
                HEADER
            ================================== */}

            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2
                  id="delete-category-title"
                  className="text-base font-semibold text-foreground"
                >
                  Delete Category
                </h2>

                <Text className="mt-1 text-xs text-muted-foreground">
                  Confirmation required
                </Text>
              </div>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* =================================
                CONTENT
            ================================== */}

            <div className="px-5 py-6">
              <Text className="text-sm leading-6 text-foreground">
                Are you sure you want to delete category{" "}
                <span className="font-semibold text-foreground">
                  {categoryName}
                </span>
                ?
              </Text>

              <Text className="mt-2 text-sm text-muted-foreground">
                This action cannot be undone.
              </Text>
            </div>

            {/* =================================
                FOOTER
            ================================== */}

            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              {/* CANCEL */}

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              {/* DELETE */}

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Category"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
