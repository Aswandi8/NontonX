"use client";

import { ShieldCheck, UserRound, X } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";

import { changeUserRole } from "@/app/(protected)/(admin)/users/actions";

interface UserRoleButtonProps {
  userId: string;
  userName: string;
  currentRole: string;
  disabled?: boolean;
}

type UserRole = "USER" | "ADMIN";

export default function UserRoleButton({
  userId,
  userName,
  currentRole,
  disabled = false,
}: UserRoleButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    currentRole === "ADMIN" ? "ADMIN" : "USER",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================
     ROLE HELPERS
  ========================================= */

  const normalizedRole: UserRole = currentRole === "ADMIN" ? "ADMIN" : "USER";

  const RoleIcon = normalizedRole === "ADMIN" ? ShieldCheck : UserRound;

  const roleLabel = normalizedRole === "ADMIN" ? "Admin" : "User";

  /* =========================================
     OPEN
  ========================================= */

  const handleOpen = () => {
    if (disabled || isSubmitting) {
      return;
    }

    setSelectedRole(normalizedRole);

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
     SAVE
  ========================================= */

  const handleSave = async () => {
    if (selectedRole === normalizedRole) {
      toast.error(`User is already ${selectedRole}.`);

      return;
    }

    try {
      setIsSubmitting(true);

      const result = await changeUserRole({
        userId,
        role: selectedRole,
      });

      if (!result.success) {
        toast.error(result.error ?? "Unable to change user role.");

        return;
      }

      toast.success(result.message ?? "User role updated successfully.");

      setIsOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Change user role error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =====================================
          ROLE BUTTON
      ====================================== */}

      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled || isSubmitting}
        aria-label={`Change role for ${userName}`}
        title={`Change role for ${userName}`}
        className={
          normalizedRole === "ADMIN"
            ? "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:pointer-events-none disabled:opacity-50"
            : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 disabled:pointer-events-none disabled:opacity-50"
        }
      >
        <RoleIcon className="size-3.5 shrink-0" />

        <span>{roleLabel}</span>
      </button>

      {/* =====================================
          MODAL
      ====================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-role-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            {/* =================================
                HEADER
            ================================== */}

            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2
                  id="change-role-title"
                  className="text-base font-semibold text-foreground"
                >
                  Change User Role
                </h2>

                <Text className="mt-1 text-xs text-muted-foreground">
                  Manage user permissions
                </Text>
              </div>

              {/* CLOSE */}

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

            {/* =================================
                CONTENT
            ================================== */}

            <div className="space-y-5 px-5 py-6">
              {/* USER INFORMATION */}

              <div>
                <Text className="text-sm font-medium">{userName}</Text>

                <Text className="mt-1 text-xs text-muted-foreground">
                  Current role: {roleLabel}
                </Text>
              </div>

              {/* =================================
                  ROLE OPTIONS
              ================================== */}

              <div className="grid grid-cols-2 gap-3">
                {/* =================================
                    USER
                ================================== */}

                <button
                  type="button"
                  onClick={() => setSelectedRole("USER")}
                  disabled={isSubmitting}
                  aria-pressed={selectedRole === "USER"}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selectedRole === "USER"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <UserRound className="size-5 shrink-0" />

                  <div>
                    <Text className="text-sm font-medium text-current">
                      User
                    </Text>

                    <Text className="mt-1 text-xs text-muted-foreground">
                      Standard access
                    </Text>
                  </div>
                </button>

                {/* =================================
                    ADMIN
                ================================== */}

                <button
                  type="button"
                  onClick={() => setSelectedRole("ADMIN")}
                  disabled={isSubmitting}
                  aria-pressed={selectedRole === "ADMIN"}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selectedRole === "ADMIN"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <ShieldCheck className="size-5 shrink-0" />

                  <div>
                    <Text className="text-sm font-medium text-current">
                      Admin
                    </Text>

                    <Text className="mt-1 text-xs text-muted-foreground">
                      Full access
                    </Text>
                  </div>
                </button>
              </div>
            </div>

            {/* =================================
                FOOTER
            ================================== */}

            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
