import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardHeader from "@/components/dashboard/header/Header";

import { Heading, Text } from "@/components/typography";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

import CreateVideoForm from "./CreateVideoForm";

export default async function CreateVideoPage() {
  /* =========================================
     AUTH
  ========================================= */

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen">
      {/* =====================================
          HEADER
      ====================================== */}

      <DashboardHeader
        title="Create Video"
        breadcrumb={["Admin", "Videos", "Create"]}
      />

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <section>
          <Heading className="text-2xl font-semibold">Create Video</Heading>

          <Text className="mt-1 text-sm text-muted-foreground">
            Add a new video to NontonX.
          </Text>
        </section>

        {/* =====================================
            FORM
        ====================================== */}

        <section className="rounded-xl border border-border bg-card">
          <div className="p-6">
            <CreateVideoForm categories={categories} />
          </div>
        </section>
      </div>
    </div>
  );
}
