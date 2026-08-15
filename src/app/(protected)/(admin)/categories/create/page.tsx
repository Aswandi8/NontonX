import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import DashboardHeader from "@/components/dashboard/header/Header";
import { Heading, Text } from "@/components/typography";

export default function CreateCategoryPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Add Category"
        breadcrumb={["Admin", "Categories", "Add Category"]}
      />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard/categories"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Categories
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <Heading className="text-xl font-semibold">Create Category</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Add a new category for your videos.
            </Text>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Example: Anime"
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Category description..."
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/categories"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
