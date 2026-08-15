"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* =========================================
   PROFILE SCHEMA
========================================= */

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must not exceed 50 characters."),
});

/* =========================================
   UPDATE PROFILE
========================================= */

export async function updateProfile(input: unknown) {
  try {
    /* =======================================
       VALIDATION
    ======================================== */

    const validation = updateProfileSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid profile data.",
      };
    }

    const { name } = validation.data;

    /* =======================================
       SESSION
    ======================================== */

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "You must be signed in to update your profile.",
      };
    }

    /* =======================================
       CHECK USER
    ======================================== */

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!currentUser) {
      return {
        success: false,
        error: "Your account could not be found.",
      };
    }

    /* =======================================
       CHECK ACCOUNT STATUS
    ======================================== */

    if (!currentUser.isActive) {
      return {
        success: false,
        error: "Your account has been disabled.",
      };
    }

    /* =======================================
       CHECK SAME NAME
    ======================================== */

    if (currentUser.name === name) {
      return {
        success: false,
        error: "There are no changes to save.",
      };
    }

    /* =======================================
       UPDATE
    ======================================== */

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },

      data: {
        name,
      },
    });

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Update profile error:", error);

    return {
      success: false,
      error: "Something went wrong while updating your profile.",
    };
  }
}
