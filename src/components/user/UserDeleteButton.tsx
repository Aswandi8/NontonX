"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";

import { deleteUser } from "@/app/(protected)/(admin)/users/actions";

interface UserDeleteButtonProps {
  userId: string;
  userName: string;
  disabled?: boolean;
}

export default function UserDeleteButton({
  userId,
  userName,
  disabled = false,
}: UserDeleteButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================================
     OPEN DELETE CONFIRMATION
  ========================================= */

  const handleOpen = () => {
    if (disabled || isDeleting) {
      return;
    }

    setIsOpen(true);
  };

  /* =========================================
     CLOSE DELETE CONFIRMATION
  ========================================= */

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setIsOpen(false);
  };

  /* =========================================
     DELETE USER
  ========================================= */

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteUser({
        userId,
      });

      /* =====================================
         ERROR
      ====================================== */

      if (!result.success) {
        toast.error(result.error ?? "Unable to delete user.");

        return;
      }

      /* =====================================
         SUCCESS
      ====================================== */

      toast.success(result.message ?? "User deleted successfully.");

      setIsOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Delete user error:", error);

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
        onClick={handleOpen}
        disabled={disabled || isDeleting}
        aria-disabled={disabled || isDeleting}
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
        Delete
      </Button>

      {/* =====================================
          CONFIRMATION POPUP
      ====================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* =================================
                HEADER
            ================================== */}

            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="size-5 text-destructive" />
                </div>

                <div>
                  <h2
                    id="delete-user-title"
                    className="text-base font-semibold text-foreground"
                  >
                    Delete User
                  </h2>

                  <Text className="mt-1 text-xs text-muted-foreground">
                    This action cannot be undone.
                  </Text>
                </div>
              </div>

              {/* CLOSE */}

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
                Apakah Anda yakin ingin menghapus user{" "}
                <span className="font-semibold">{userName}</span>?
              </Text>

              <Text className="mt-3 text-sm leading-6 text-muted-foreground">
                Akun user beserta data terkait akan dihapus secara permanen dan
                tindakan ini tidak dapat dibatalkan.
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
                aria-disabled={isDeleting}
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
                {isDeleting ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
