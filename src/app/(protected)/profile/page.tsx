import { redirect } from "next/navigation";
import { headers } from "next/headers";

import DashboardHeader from "@/components/dashboard/header/Header";
import { Heading, Text } from "@/components/typography";
import ProfileForm from "@/components/profile/ProfileForm";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  /* =========================================
     GET SESSION
  ========================================= */

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  /* =========================================
     REQUIRE LOGIN
  ========================================= */

  if (!session?.user) {
    redirect("/sign-in");
  }

  /* =========================================
     GET CURRENT USER
  ========================================= */

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    select: {
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  /* =========================================
     USER NOT FOUND
  ========================================= */

  if (!user) {
    redirect("/sign-in");
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="min-h-screen">
      {/* =======================================
          HEADER
      ======================================== */}

      <DashboardHeader title="Profile" breadcrumb={["Account", "Profile"]} />

      {/* =======================================
          CONTENT
      ======================================== */}

      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================
            PAGE TITLE
        ====================================== */}

        <section>
          <Heading className="text-2xl font-semibold">Profile</Heading>

          <Text className="mt-1 text-sm text-muted-foreground">
            Manage your personal information.
          </Text>
        </section>

        {/* =====================================
            PROFILE
        ====================================== */}

        <section>
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role === "ADMIN" ? "ADMIN" : "USER",
              isActive: user.isActive,
              emailVerified: user.emailVerified,
              createdAt: user.createdAt,
            }}
          />
        </section>
      </div>
    </div>
  );
}
