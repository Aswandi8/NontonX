import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Jika sudah login,
  // jangan izinkan membuka halaman auth.
  if (session) {
    redirect("/dashboard");
  }

  return <main className="min-h-screen bg-background">{children}</main>;
}
