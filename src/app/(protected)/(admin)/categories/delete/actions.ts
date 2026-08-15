"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export async function deleteCategory(id: string) {
  if (!id) {
    return {
      success: false,
      error: "Category ID is required.",
    };
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Category not found.",
      };
    }

    if (category._count.videos > 0) {
      return {
        success: false,
        error: `This category cannot be deleted because it has ${category._count.videos} video${
          category._count.videos > 1 ? "s" : ""
        }.`,
      };
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/categories");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete category error:", error);

    return {
      success: false,
      error: "Failed to delete category. Please try again.",
    };
  }
}
