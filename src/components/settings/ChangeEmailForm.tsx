"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

import { Label, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { authClient } from "@/lib/auth-client";

/* =========================================
   SCHEMA
========================================= */

const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .min(1, "New email is required.")
    .email("Please enter a valid email address."),
});

/* =========================================
   TYPE
========================================= */

type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

/* =========================================
   PROPS
========================================= */

interface ChangeEmailFormProps {
  currentEmail: string;
}

/* =========================================
   COMPONENT
========================================= */

export default function ChangeEmailForm({
  currentEmail,
}: ChangeEmailFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),

    defaultValues: {
      newEmail: "",
    },
  });

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = async (data: ChangeEmailFormData) => {
    const newEmail = data.newEmail.trim();

    /* =======================================
       SAME EMAIL
    ======================================== */

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      toast.error("New email must be different from your current email.");

      return;
    }

    try {
      const result = await authClient.changeEmail({
        newEmail,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Unable to change email.");

        return;
      }

      toast.success("Verification email sent to your new email address.");

      reset();
    } catch (error) {
      console.error("Change email error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* =====================================
          CURRENT EMAIL
      ====================================== */}

      <div className="space-y-2">
        <Label htmlFor="currentEmail">Current Email</Label>

        <Input
          id="currentEmail"
          type="email"
          value={currentEmail}
          disabled
          readOnly
        />

        <Text className="text-xs text-muted-foreground">
          This is the email address currently associated with your account.
        </Text>
      </div>

      {/* =====================================
          NEW EMAIL
      ====================================== */}

      <div className="space-y-2">
        <Label htmlFor="newEmail">New Email</Label>

        <Input
          id="newEmail"
          type="email"
          placeholder="Enter your new email"
          autoComplete="email"
          {...register("newEmail")}
          aria-invalid={!!errors.newEmail}
          disabled={isSubmitting}
        />

        {errors.newEmail && (
          <Text className="text-sm text-destructive">
            {errors.newEmail.message}
          </Text>
        )}

        <Text className="text-xs text-muted-foreground">
          A verification link will be sent to your new email address.
        </Text>
      </div>

      {/* =====================================
          INFORMATION
      ====================================== */}

      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <MailCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <Text className="text-xs leading-5 text-muted-foreground">
          Your email address will only change after you verify the new email
          address.
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
          {isSubmitting ? "Sending..." : "Change Email"}
        </Button>
      </div>
    </form>
  );
}
