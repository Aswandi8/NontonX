"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* =========================================
   SCHEMAS
========================================= */

const changeRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required."),

  role: z.enum(["USER", "ADMIN"]),
});

const toggleUserStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required."),

  isActive: z.boolean(),
});

const deleteUserSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
});

/* =========================================
   GET CURRENT ADMIN
========================================= */

async function getCurrentAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false as const,
      error: "You must be signed in.",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    select: {
      id: true,
      role: true,
      isActive: true,
    },
  });

  if (!currentUser) {
    return {
      success: false as const,
      error: "Current user was not found.",
    };
  }

  if (!currentUser.isActive) {
    return {
      success: false as const,
      error: "Your account has been disabled.",
    };
  }

  if (currentUser.role !== "ADMIN") {
    return {
      success: false as const,
      error: "You do not have permission to perform this action.",
    };
  }

  return {
    success: true as const,
    user: currentUser,
  };
}

/* =========================================
   CHANGE USER ROLE
========================================= */

export async function changeUserRole(input: unknown) {
  try {
    /* =======================================
       VALIDATION
    ======================================== */

    const validation = changeRoleSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid request.",
      };
    }

    const { userId, role } = validation.data;

    /* =======================================
       CHECK ADMIN
    ======================================== */

    const admin = await getCurrentAdmin();

    if (!admin.success) {
      return admin;
    }

    /* =======================================
       PREVENT SELF ROLE CHANGE
    ======================================== */

    if (admin.user.id === userId) {
      return {
        success: false,
        error: "You cannot change your own role.",
      };
    }

    /* =======================================
       TARGET USER
    ======================================== */

    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    /* =======================================
       NO CHANGE
    ======================================== */

    if (targetUser.role === role) {
      return {
        success: false,
        error: `User is already ${role}.`,
      };
    }

    /* =======================================
       UPDATE ROLE
    ======================================== */

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        role,
      },
    });

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: `User "${targetUser.name}" role changed to ${role}.`,
    };
  } catch (error) {
    console.error("Change user role error:", error);

    return {
      success: false,
      error: "Something went wrong while changing the user role.",
    };
  }
}

/* =========================================
   TOGGLE USER STATUS
========================================= */

export async function toggleUserStatus(input: unknown) {
  try {
    /* =======================================
       VALIDATION
    ======================================== */

    const validation = toggleUserStatusSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid request.",
      };
    }

    const { userId, isActive } = validation.data;

    /* =======================================
       CHECK ADMIN
    ======================================== */

    const admin = await getCurrentAdmin();

    if (!admin.success) {
      return admin;
    }

    /* =======================================
       PREVENT SELF STATUS CHANGE
    ======================================== */

    if (admin.user.id === userId) {
      return {
        success: false,
        error: "You cannot change your own account status.",
      };
    }

    /* =======================================
       TARGET USER
    ======================================== */

    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    /* =======================================
       NO CHANGE
    ======================================== */

    if (targetUser.isActive === isActive) {
      return {
        success: false,
        error: isActive
          ? "User is already active."
          : "User is already disabled.",
      };
    }

    /* =======================================
       UPDATE STATUS
    ======================================== */

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isActive,
      },
    });

    /* =======================================
       DELETE SESSIONS WHEN DISABLED
    ======================================== */

    if (!isActive) {
      await prisma.session.deleteMany({
        where: {
          userId,
        },
      });
    }

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: isActive
        ? `User "${targetUser.name}" has been enabled successfully.`
        : `User "${targetUser.name}" has been disabled successfully.`,
    };
  } catch (error) {
    console.error("Toggle user status error:", error);

    return {
      success: false,
      error: "Something went wrong while updating user status.",
    };
  }
}

/* =========================================
   DELETE USER
========================================= */

export async function deleteUser(input: unknown) {
  try {
    /* =======================================
       VALIDATION
    ======================================== */

    const validation = deleteUserSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid request.",
      };
    }

    const { userId } = validation.data;

    /* =======================================
       CHECK ADMIN
    ======================================== */

    const admin = await getCurrentAdmin();

    if (!admin.success) {
      return admin;
    }

    /* =======================================
       PREVENT SELF DELETE
    ======================================== */

    if (admin.user.id === userId) {
      return {
        success: false,
        error: "You cannot delete your own account.",
      };
    }

    /* =======================================
       TARGET USER
    ======================================== */

    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    /* =======================================
       DELETE USER
    ======================================== */

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: `User "${targetUser.name}" has been deleted successfully.`,
    };
  } catch (error) {
    console.error("Delete user error:", error);

    return {
      success: false,
      error: "Something went wrong while deleting the user.",
    };
  }
}
