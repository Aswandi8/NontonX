"use client";

import { Power, PowerOff, X } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";

import { toggleUserStatus } from "@/app/(protected)/(admin)/users/actions";

interface UserStatusButtonProps {
  userId: string;
  userName: string;
  isActive: boolean;
  disabled?: boolean;
}

export default function UserStatusButton({
  userId,
  userName,
  isActive,
  disabled = false,
}: UserStatusButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================
     OPEN
  ========================================= */

  const handleOpen = () => {
    if (disabled || isSubmitting) {
      return;
    }

    setIsOpen(true);
  };

  /* =========================================
     CLOSE
  ========================================= */

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  };

  /* =========================================
     CONFIRM
  ========================================= */

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      const result = await toggleUserStatus({
        userId,
        isActive: !isActive,
      });

      if (!result.success) {
        toast.error(result.error ?? "Unable to update user status.");

        return;
      }

      toast.success(result.message ?? "User status updated successfully.");

      setIsOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Toggle user status error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =====================================
          STATUS BUTTON
      ====================================== */}

      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled || isSubmitting}
        className={
          isActive
            ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400 disabled:pointer-events-none disabled:opacity-50"
            : "inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50"
        }
      >
        {isActive ? (
          <Power className="size-3.5" />
        ) : (
          <PowerOff className="size-3.5" />
        )}

        {isActive ? "Active" : "Disabled"}
      </button>

      {/* =====================================
          CONFIRMATION MODAL
      ====================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-status-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2
                  id="user-status-title"
                  className="text-base font-semibold text-foreground"
                >
                  {isActive ? "Disable User" : "Enable User"}
                </h2>

                <Text className="mt-1 text-xs text-muted-foreground">
                  User account management
                </Text>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* CONTENT */}

            <div className="px-5 py-6">
              <Text className="text-sm leading-6 text-foreground">
                {isActive
                  ? `Are you sure you want to disable user "${userName}"?`
                  : `Are you sure you want to enable user "${userName}"?`}
              </Text>

              <Text className="mt-2 text-sm leading-6 text-muted-foreground">
                {isActive
                  ? "The user will no longer be able to access their account. Existing sessions will also be removed."
                  : "The user will be able to sign in and access their account again."}
              </Text>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant={isActive ? "destructive" : "default"}
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isActive
                    ? "Disabling..."
                    : "Enabling..."
                  : isActive
                    ? "Disable User"
                    : "Enable User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
