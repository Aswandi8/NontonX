import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/dashboard/header/Header";
import CategoryForm from "@/components/category/CategoryForm";
import { Heading, Text } from "@/components/typography";

import { createCategory } from "./actions";

export default function CreateCategoryPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Create Category"
        breadcrumb={["Admin", "Categories", "Create Category"]}
      />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Categories
        </Link>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <Heading className="text-xl font-semibold">Create Category</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Create a new category to organize your videos.
            </Text>
          </div>

          <CategoryForm mode="create" onSubmitAction={createCategory} />
        </div>
      </div>
    </div>
  );
}
