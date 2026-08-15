"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Text } from "@/components/typography";
import { authClient } from "@/lib/auth-client";

interface ProtectedContentProps {
  children: React.ReactNode;
  role?: "USER" | "ADMIN";
}

export default function ProtectedContent({
  children,
  role,
}: ProtectedContentProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (role && session.user.role !== role) {
      router.replace("/dashboard");
    }
  }, [session, isPending, role, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Text className="text-sm text-muted-foreground">
          Checking your access...
        </Text>
      </div>
    );
  }

  if (role && session.user.role !== role) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Text className="text-sm text-muted-foreground">Redirecting...</Text>
      </div>
    );
  }

  return <>{children}</>;
}
