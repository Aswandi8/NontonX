"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function updateCategory(id: string, data: unknown) {
  if (!id) {
    return {
      success: false,
      error: "Category ID is required.",
    };
  }

  const validation = categorySchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message ?? "Invalid category data.",
    };
  }

  const { name, description, image } = validation.data;

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      error: "Invalid category name.",
    };
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return {
        success: false,
        error: "Category not found.",
      };
    }

    const duplicateCategory = await prisma.category.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateCategory) {
      return {
        success: false,
        error: "A category with this name already exists.",
      };
    }

    await prisma.category.update({
      where: {
        id,
      },

      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
      },
    });

    revalidatePath("/categories");

    revalidatePath(`/categories/${id}/edit`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update category error:", error);

    return {
      success: false,
      error: "Failed to update category. Please try again.",
    };
  }
}
