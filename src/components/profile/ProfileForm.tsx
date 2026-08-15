"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

import { Image } from "@/components/media";
import { Label, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";

import { updateProfile } from "@/app/(protected)/profile/actions";

/* =========================================
   SCHEMA
========================================= */

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must not exceed 50 characters."),
});

/* =========================================
   TYPE
========================================= */

type ProfileFormData = z.infer<typeof profileSchema>;

/* =========================================
   PROPS
========================================= */

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    image: string | null;
    role: "USER" | "ADMIN";
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
  };
}

/* =========================================
   COMPONENT
========================================= */

export default function ProfileForm({ user }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      name: user.name,
    },
  });

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data);

      /* =====================================
         ERROR
      ====================================== */

      if (!result.success) {
        toast.error(result.error ?? "Unable to update profile.");

        return;
      }

      /* =====================================
         SUCCESS
      ====================================== */

      toast.success(result.message ?? "Profile updated successfully.");

      /*
       * Refresh server data.
       */

      window.location.reload();
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  /* =========================================
     AVATAR
  ========================================= */

  const imageSrc =
    user.image && user.image !== "default.jpg" ? user.image : "/default.jpg";

  /* =========================================
     ROLE
  ========================================= */

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-6">
      {/* =====================================
          PROFILE HEADER
      ====================================== */}

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* AVATAR */}

          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            <Image
              src={imageSrc}
              alt={user.name}
              width={96}
              height={96}
              className="size-24 rounded-full object-cover"
            />
          </div>

          {/* USER INFO */}

          <div className="min-w-0">
            <Text className="text-xl font-semibold text-foreground">
              {user.name}
            </Text>

            <Text className="mt-1 truncate text-sm text-muted-foreground">
              {user.email}
            </Text>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* ROLE */}

              <span
                className={
                  isAdmin
                    ? "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {isAdmin ? (
                  <ShieldCheck className="size-3.5" />
                ) : (
                  <UserRound className="size-3.5" />
                )}

                {isAdmin ? "Admin" : "User"}
              </span>

              {/* STATUS */}

              <span
                className={
                  user.isActive
                    ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    : "inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                }
              >
                {user.isActive ? "Active" : "Disabled"}
              </span>

              {/* EMAIL */}

              <span
                className={
                  user.emailVerified
                    ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    : "inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {user.emailVerified ? "Email Verified" : "Email Unverified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          PROFILE INFORMATION
      ====================================== */}

      <div className="rounded-xl border border-border bg-card">
        {/* HEADER */}

        <div className="border-b border-border px-6 py-5">
          <Text className="text-base font-semibold">Profile Information</Text>

          <Text className="mt-1 text-sm text-muted-foreground">
            Update your personal information.
          </Text>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* =================================
              NAME
          ================================== */}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              {...register("name")}
              aria-invalid={!!errors.name}
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* =================================
              EMAIL
          ================================== */}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              readOnly
              className="flex h-10 w-full cursor-not-allowed rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground outline-none"
            />

            <Text className="text-xs text-muted-foreground">
              Email address cannot be changed here.
            </Text>
          </div>

          {/* =================================
              ROLE
          ================================== */}

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>

            <div className="flex h-10 items-center gap-2 rounded-lg border border-input bg-muted px-3 text-sm text-muted-foreground">
              {isAdmin ? (
                <ShieldCheck className="size-4 text-primary" />
              ) : (
                <UserRound className="size-4" />
              )}

              {isAdmin ? "Admin" : "User"}
            </div>

            <Text className="text-xs text-muted-foreground">
              Your role can only be changed by an administrator.
            </Text>
          </div>

          {/* =================================
              MEMBER SINCE
          ================================== */}

          <div className="space-y-2">
            <Label htmlFor="memberSince">Member Since</Label>

            <div className="flex h-10 items-center rounded-lg border border-input bg-muted px-3 text-sm text-muted-foreground">
              {new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(user.createdAt)}
            </div>
          </div>

          {/* =================================
              ACTIONS
          ================================== */}

          <div className="flex justify-end border-t border-border pt-5">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              aria-disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
