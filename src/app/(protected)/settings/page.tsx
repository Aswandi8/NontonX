import { headers } from "next/headers";

import DashboardHeader from "@/components/dashboard/header/Header";
import ActiveSessions from "@/components/settings/ActiveSessions";
import ChangeEmailForm from "@/components/settings/ChangeEmailForm";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";

import { Heading, Text } from "@/components/typography";

import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  /* =========================================
     REQUEST HEADERS
  ========================================= */

  const requestHeaders = await headers();

  /* =========================================
     CURRENT SESSION
  ========================================= */

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  /* =========================================
     AUTHORIZATION
  ========================================= */

  if (!session?.user) {
    return null;
  }

  /* =========================================
     ALL ACTIVE SESSIONS
  ========================================= */

  const sessions = await auth.api.listSessions({
    headers: requestHeaders,
  });

  return (
    <div className="min-h-screen">
      {/* =====================================
          HEADER
      ====================================== */}

      <DashboardHeader title="Settings" breadcrumb={["Account", "Settings"]} />

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <section>
          <Heading className="text-2xl font-semibold">Settings</Heading>

          <Text className="mt-1 text-sm text-muted-foreground">
            Manage your account and security settings.
          </Text>
        </section>

        {/* =====================================
            ACCOUNT
        ====================================== */}

        <section className="rounded-xl border border-border bg-card">
          {/* HEADER */}

          <div className="border-b border-border px-6 py-5">
            <Heading className="text-lg font-semibold">Account</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Manage your account information and password.
            </Text>
          </div>

          {/* CONTENT */}

          <div className="p-6">
            {/* =================================
                CHANGE PASSWORD
            ================================== */}

            <div>
              <Heading className="text-base font-semibold">
                Change Password
              </Heading>

              <Text className="mt-1 text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </Text>

              <div className="mt-6">
                <ChangePasswordForm />
              </div>
            </div>

            {/* =================================
                CHANGE EMAIL
            ================================== */}

            <div className="mt-10 border-t border-border pt-10">
              <Heading className="text-base font-semibold">
                Change Email
              </Heading>

              <Text className="mt-1 text-sm text-muted-foreground">
                Update the email address associated with your account.
              </Text>

              <div className="mt-6">
                <ChangeEmailForm currentEmail={session.user.email} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            SECURITY
        ====================================== */}

        <section className="rounded-xl border border-border bg-card">
          {/* HEADER */}

          <div className="border-b border-border px-6 py-5">
            <Heading className="text-lg font-semibold">Security</Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Manage your active sessions and account security.
            </Text>
          </div>

          {/* CONTENT */}

          <div className="p-6">
            <ActiveSessions
              sessions={sessions}
              currentSessionToken={session.session.token}
            />
          </div>
        </section>

        {/* =====================================
            DANGER ZONE
        ====================================== */}

        <section className="rounded-xl border border-destructive/30 bg-card">
          {/* HEADER */}

          <div className="border-b border-destructive/30 px-6 py-5">
            <Heading className="text-lg font-semibold text-destructive">
              Danger Zone
            </Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              These actions can permanently affect your account.
            </Text>
          </div>

          {/* CONTENT */}

          <div className="p-6">
            <Heading className="text-base font-semibold">
              Delete Account
            </Heading>

            <Text className="mt-1 text-sm text-muted-foreground">
              Permanently delete your NontonX account and associated data.
            </Text>
          </div>
        </section>
      </div>
    </div>
  );
}
