"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

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

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/* =========================================
   CHANGE PASSWORD
========================================= */

export async function changePassword(input: ChangePasswordInput) {
  try {
    /* =======================================
       VALIDATE INPUT
    ======================================== */

    const validation = changePasswordSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid password data.",
      };
    }

    const { currentPassword, newPassword } = validation.data;

    /* =======================================
       CHECK SESSION
    ======================================== */

    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session?.user) {
      return {
        success: false,
        error: "You must be signed in to change your password.",
      };
    }

    /* =======================================
       CHANGE PASSWORD
    ======================================== */

    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,

        /*
         * Keep the current session active.
         *
         * Other sessions will also remain active.
         * Session management will be handled
         * separately under Security.
         */
        revokeOtherSessions: false,
      },

      headers: requestHeaders,
    });

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: "Password changed successfully.",
    };
  } catch (error) {
    console.error("Change password error:", error);

    return {
      success: false,
      error:
        "Unable to change your password. Please check your current password and try again.",
    };
  }
}
