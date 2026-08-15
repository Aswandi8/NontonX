"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* =========================================
   CREATE VIDEO SCHEMA
========================================= */

const createVideoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title is too long."),

  description: z
    .string()
    .trim()
    .max(5000, "Description is too long.")
    .optional(),

  thumbnail: z
    .string()
    .trim()
    .url("Thumbnail must be a valid URL.")
    .optional()
    .or(z.literal("")),

  videoUrl: z.string().trim().url("Video URL must be a valid URL."),

  duration: z.number().int().min(0).nullable(),

  categoryIds: z.array(z.string()),

  isPublished: z.boolean(),
});

/* =========================================
   UPDATE VIDEO SCHEMA
========================================= */

const updateVideoSchema = createVideoSchema.extend({
  videoId: z.string().trim().min(1, "Video ID is required."),
});

/* =========================================
   TYPES
========================================= */

export type CreateVideoInput = z.infer<typeof createVideoSchema>;

export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;

/* =========================================
   GENERATE SLUG
========================================= */

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* =========================================
   UNIQUE SLUG — CREATE
========================================= */

async function generateUniqueSlug(title: string) {
  const baseSlug = generateSlug(title);

  /*
   * Jika title tidak menghasilkan slug,
   * gunakan slug fallback.
   */

  if (!baseSlug) {
    return `video-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 2;

  while (
    await prisma.video.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/* =========================================
   UNIQUE SLUG — UPDATE
========================================= */

async function generateUniqueSlugForUpdate(title: string, videoId: string) {
  const baseSlug = generateSlug(title);

  /*
   * Jika title tidak menghasilkan slug,
   * gunakan slug fallback.
   */

  if (!baseSlug) {
    return `video-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existingVideo = await prisma.video.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    /*
     * Tidak ada video lain
     * yang menggunakan slug.
     */
    if (!existingVideo) {
      return slug;
    }

    /*
     * Slug milik video yang sedang diedit.
     * Slug tersebut boleh digunakan.
     */
    if (existingVideo.id === videoId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/* =========================================
   ADMIN AUTHORIZATION
========================================= */

async function requireAdmin() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return {
      success: false as const,
      error: "Unauthorized.",
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      success: false as const,
      error: "You do not have permission to manage videos.",
    };
  }

  return {
    success: true as const,
    user: session.user,
  };
}

/* =========================================
   CREATE VIDEO
========================================= */

export async function createVideo(input: CreateVideoInput) {
  try {
    /* =======================================
       AUTHORIZATION
    ======================================== */

    const authorization = await requireAdmin();

    if (!authorization.success) {
      return authorization;
    }

    /* =======================================
       VALIDATION
    ======================================== */

    const validation = createVideoSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid video data.",
      };
    }

    const data = validation.data;

    /* =======================================
       GENERATE SLUG
    ======================================== */

    const slug = await generateUniqueSlug(data.title);

    /* =======================================
       CHECK CATEGORIES
    ======================================== */

    if (data.categoryIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: {
          id: {
            in: data.categoryIds,
          },
        },

        select: {
          id: true,
        },
      });

      if (categories.length !== data.categoryIds.length) {
        return {
          success: false,
          error: "One or more selected categories do not exist.",
        };
      }
    }

    /* =======================================
       CREATE VIDEO
    ======================================== */

    await prisma.video.create({
      data: {
        title: data.title,

        /*
         * Slug dibuat otomatis
         * oleh server.
         */
        slug,

        description: data.description || null,

        thumbnail: data.thumbnail || null,

        videoUrl: data.videoUrl,

        duration: data.duration,

        isPublished: data.isPublished,

        categories: {
          connect: data.categoryIds.map((id) => ({
            id,
          })),
        },
      },
    });

    /* =======================================
       REVALIDATE
    ======================================== */

    revalidatePath("/videos");

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: "Video created successfully.",
    };
  } catch (error) {
    console.error("Create video error:", error);

    return {
      success: false,
      error: "Unable to create video. Please try again.",
    };
  }
}

/* =========================================
   UPDATE VIDEO
========================================= */

export async function updateVideo(input: UpdateVideoInput) {
  try {
    /* =======================================
       AUTHORIZATION
    ======================================== */

    const authorization = await requireAdmin();

    if (!authorization.success) {
      return authorization;
    }

    /* =======================================
       VALIDATION
    ======================================== */

    const validation = updateVideoSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid video data.",
      };
    }

    const data = validation.data;

    /* =======================================
       CHECK VIDEO
    ======================================== */

    const existingVideo = await prisma.video.findUnique({
      where: {
        id: data.videoId,
      },

      select: {
        id: true,
      },
    });

    if (!existingVideo) {
      return {
        success: false,
        error: "Video not found.",
      };
    }

    /* =======================================
       CHECK CATEGORIES
    ======================================== */

    if (data.categoryIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: {
          id: {
            in: data.categoryIds,
          },
        },

        select: {
          id: true,
        },
      });

      if (categories.length !== data.categoryIds.length) {
        return {
          success: false,
          error: "One or more selected categories do not exist.",
        };
      }
    }

    /* =======================================
       GENERATE SLUG
    ======================================== */

    const slug = await generateUniqueSlugForUpdate(data.title, data.videoId);

    /* =======================================
       UPDATE VIDEO
    ======================================== */

    await prisma.video.update({
      where: {
        id: data.videoId,
      },

      data: {
        title: data.title,

        /*
         * Slug tetap otomatis.
         * Jika title berubah,
         * slug ikut diperbarui.
         */
        slug,

        description: data.description || null,

        thumbnail: data.thumbnail || null,

        videoUrl: data.videoUrl,

        duration: data.duration,

        isPublished: data.isPublished,

        /*
         * Reset relasi kategori
         * kemudian connect kembali
         * dengan kategori terbaru.
         */
        categories: {
          set: data.categoryIds.map((id) => ({
            id,
          })),
        },
      },
    });

    /* =======================================
       REVALIDATE
    ======================================== */

    revalidatePath("/videos");

    revalidatePath(`/videos/${data.videoId}/edit`);

    /* =======================================
       SUCCESS
    ======================================== */

    return {
      success: true,
      message: "Video updated successfully.",
    };
  } catch (error) {
    console.error("Update video error:", error);

    return {
      success: false,
      error: "Unable to update video. Please try again.",
    };
  }
}

/* =========================================
   TOGGLE PUBLISHED
========================================= */

export async function toggleVideoPublished(input: { videoId: string }) {
  try {
    const authorization = await requireAdmin();

    if (!authorization.success) {
      return authorization;
    }

    const video = await prisma.video.findUnique({
      where: {
        id: input.videoId,
      },

      select: {
        id: true,
        title: true,
        isPublished: true,
      },
    });

    if (!video) {
      return {
        success: false,
        error: "Video not found.",
      };
    }

    const updatedVideo = await prisma.video.update({
      where: {
        id: video.id,
      },

      data: {
        isPublished: !video.isPublished,
      },

      select: {
        isPublished: true,
      },
    });

    revalidatePath("/videos");

    return {
      success: true,

      isPublished: updatedVideo.isPublished,

      message: updatedVideo.isPublished
        ? "Video published successfully."
        : "Video unpublished successfully.",
    };
  } catch (error) {
    console.error("Toggle video published error:", error);

    return {
      success: false,
      error: "Unable to update video status.",
    };
  }
}

/* =========================================
   DELETE VIDEO
========================================= */

export async function deleteVideo(input: { videoId: string }) {
  try {
    const authorization = await requireAdmin();

    if (!authorization.success) {
      return authorization;
    }

    const video = await prisma.video.findUnique({
      where: {
        id: input.videoId,
      },

      select: {
        id: true,
        title: true,
      },
    });

    if (!video) {
      return {
        success: false,
        error: "Video not found.",
      };
    }

    await prisma.video.delete({
      where: {
        id: video.id,
      },
    });

    revalidatePath("/videos");

    return {
      success: true,

      message: `"${video.title}" deleted successfully.`,
    };
  } catch (error) {
    console.error("Delete video error:", error);

    return {
      success: false,
      error: "Unable to delete video. Please try again.",
    };
  }
}
