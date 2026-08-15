import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/dashboard/header/Header";
import CategoryForm from "@/components/category/CategoryForm";
import { Heading, Text } from "@/components/typography";

import prisma from "@/lib/prisma";
import { updateCategory } from "./actions";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Edit Category"
        breadcrumb={["Admin", "Categories", "Edit Category"]}
      />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {/* BACK */}

        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Categories
        </Link>

        {/* CARD */}

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <Heading className="text-xl font-semibold">Edit Category</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Update the information for this category.
            </Text>
          </div>

          <CategoryForm
            mode="edit"
            defaultValues={{
              name: category.name,
              description: category.description ?? "",
              image: category.image ?? "",
            }}
            onSubmitAction={async (data) => {
              "use server";

              return updateCategory(category.id, data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
