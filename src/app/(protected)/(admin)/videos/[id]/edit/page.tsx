import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import DashboardHeader from "@/components/dashboard/header/Header";
import { Heading, Text } from "@/components/typography";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

import EditVideoForm from "./EditVideoForm";

interface EditVideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
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
     PARAMS
  ========================================= */

  const { id } = await params;

  /* =========================================
     VIDEO
  ========================================= */

  const video = await prisma.video.findUnique({
    where: {
      id,
    },

    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!video) {
    notFound();
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
        title="Edit Video"
        breadcrumb={["Admin", "Videos", "Edit"]}
      />

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <section>
          <Heading className="text-2xl font-semibold">Edit Video</Heading>

          <Text className="mt-1 text-sm text-muted-foreground">
            Update video information on NontonX.
          </Text>
        </section>

        {/* =====================================
            FORM
        ====================================== */}

        <section className="rounded-xl border border-border bg-card">
          <div className="p-6">
            <EditVideoForm video={video} categories={categories} />
          </div>
        </section>
      </div>
    </div>
  );
}
