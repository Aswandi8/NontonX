"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

import { Label, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { changePassword } from "@/app/(protected)/settings/actions";

/* =========================================
   SCHEMA
========================================= */

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters.")
      .max(100, "New password must not exceed 100 characters."),

    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });

/* =========================================
   TYPE
========================================= */

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/* =========================================
   COMPONENT
========================================= */

export default function ChangePasswordForm() {
  /* =========================================
     PASSWORD VISIBILITY
  ========================================= */

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =========================================
     FORM
  ========================================= */

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const result = await changePassword(data);

      /* =====================================
         ERROR
      ====================================== */

      if (!result.success) {
        toast.error(result.error ?? "Unable to change password.");

        return;
      }

      /* =====================================
         SUCCESS
      ====================================== */

      toast.success(result.message ?? "Password changed successfully.");

      /* =====================================
         RESET FORM
      ====================================== */

      reset();

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Change password error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* =====================================
          CURRENT PASSWORD
      ====================================== */}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>

        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Enter current password"
            autoComplete="current-password"
            {...register("currentPassword")}
            aria-invalid={!!errors.currentPassword}
            disabled={isSubmitting}
            className="pr-11"
          />

          <Button
            type="button"
            variant="icon-plain"
            size="icon-xs"
            onClick={() => setShowCurrentPassword((value) => !value)}
            disabled={isSubmitting}
            aria-label={
              showCurrentPassword
                ? "Hide current password"
                : "Show current password"
            }
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showCurrentPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.currentPassword && (
          <Text className="text-sm text-destructive">
            {errors.currentPassword.message}
          </Text>
        )}
      </div>

      {/* =====================================
          NEW PASSWORD
      ====================================== */}

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>

        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            autoComplete="new-password"
            {...register("newPassword")}
            aria-invalid={!!errors.newPassword}
            disabled={isSubmitting}
            className="pr-11"
          />

          <Button
            type="button"
            variant="icon-plain"
            size="icon-xs"
            onClick={() => setShowNewPassword((value) => !value)}
            disabled={isSubmitting}
            aria-label={
              showNewPassword ? "Hide new password" : "Show new password"
            }
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showNewPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.newPassword && (
          <Text className="text-sm text-destructive">
            {errors.newPassword.message}
          </Text>
        )}

        <Text className="text-xs text-muted-foreground">
          Password must be at least 6 characters.
        </Text>
      </div>

      {/* =====================================
          CONFIRM PASSWORD
      ====================================== */}

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
            disabled={isSubmitting}
            className="pr-11"
          />

          <Button
            type="button"
            variant="icon-plain"
            size="icon-xs"
            onClick={() => setShowConfirmPassword((value) => !value)}
            disabled={isSubmitting}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.confirmPassword && (
          <Text className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </Text>
        )}
      </div>

      {/* =====================================
          SECURITY INFORMATION
      ====================================== */}

      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <Text className="text-xs leading-5 text-muted-foreground">
          Your current session will remain active after changing your password.
          You can manage your other sessions from the Security settings.
        </Text>
      </div>

      {/* =====================================
          ACTION
      ====================================== */}

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
