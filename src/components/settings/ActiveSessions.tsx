"use client";

import {
  Globe,
  LogOut,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/typography";

/* =========================================
   SESSION TYPE
========================================= */

interface ActiveSession {
  id: string;
  token: string;
  expiresAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/* =========================================
   PROPS
========================================= */

interface ActiveSessionsProps {
  sessions: ActiveSession[];
  currentSessionToken: string;
}

/* =========================================
   DEVICE ICON
========================================= */

function getDeviceIcon(userAgent?: string | null) {
  const value = userAgent?.toLowerCase() ?? "";

  if (
    value.includes("mobile") ||
    value.includes("android") ||
    value.includes("iphone")
  ) {
    return Smartphone;
  }

  if (value.includes("ipad") || value.includes("tablet")) {
    return Tablet;
  }

  return Monitor;
}

/* =========================================
   BROWSER
========================================= */

function getBrowserName(userAgent?: string | null) {
  const value = userAgent?.toLowerCase() ?? "";

  if (value.includes("edg")) {
    return "Microsoft Edge";
  }

  if (value.includes("chrome")) {
    return "Google Chrome";
  }

  if (value.includes("firefox")) {
    return "Mozilla Firefox";
  }

  if (value.includes("safari") && !value.includes("chrome")) {
    return "Safari";
  }

  if (value.includes("opera")) {
    return "Opera";
  }

  return "Unknown Browser";
}

/* =========================================
   OPERATING SYSTEM
========================================= */

function getOperatingSystem(userAgent?: string | null) {
  const value = userAgent?.toLowerCase() ?? "";

  if (value.includes("windows")) {
    return "Windows";
  }

  if (value.includes("mac os")) {
    return "macOS";
  }

  if (value.includes("android")) {
    return "Android";
  }

  if (value.includes("iphone") || value.includes("ipad")) {
    return "iOS";
  }

  if (value.includes("linux")) {
    return "Linux";
  }

  return "Unknown Device";
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/* =========================================
   COMPONENT
========================================= */

export default function ActiveSessions({
  sessions,
  currentSessionToken,
}: ActiveSessionsProps) {
  const router = useRouter();

  /* =========================================
     STATE
  ========================================= */

  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  const [isRevokingOthers, setIsRevokingOthers] = useState(false);

  /* =========================================
     CURRENT SESSION
  ========================================= */

  const currentSession = sessions.find(
    (session) => session.token === currentSessionToken,
  );

  /* =========================================
     OTHER SESSIONS
  ========================================= */

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken,
  );

  /* =========================================
     REVOKE ONE SESSION
  ========================================= */

  const handleRevoke = async (token: string) => {
    if (token === currentSessionToken) {
      toast.error("You cannot sign out your current session here.");

      return;
    }

    try {
      setRevokingToken(token);

      const result = await authClient.revokeSession({
        token,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Unable to sign out this session.");

        return;
      }

      toast.success("Session signed out successfully.");

      router.refresh();
    } catch (error) {
      console.error("Revoke session error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setRevokingToken(null);
    }
  };

  /* =========================================
     REVOKE OTHER SESSIONS
  ========================================= */

  const handleRevokeOthers = async () => {
    try {
      setIsRevokingOthers(true);

      const result = await authClient.revokeOtherSessions();

      if (result.error) {
        toast.error(
          result.error.message ?? "Unable to sign out other sessions.",
        );

        return;
      }

      toast.success("Other sessions have been signed out.");

      router.refresh();
    } catch (error) {
      console.error("Revoke other sessions error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsRevokingOthers(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================
          DESCRIPTION
      ====================================== */}

      <div>
        <Heading className="text-base font-semibold">Active Sessions</Heading>

        <Text className="mt-1 text-sm text-muted-foreground">
          Review the devices currently signed in to your account.
        </Text>
      </div>

      {/* =====================================
          CURRENT SESSION
      ====================================== */}

      {currentSession && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-4">
            {(() => {
              const Icon = getDeviceIcon(currentSession.userAgent);

              return (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              );
            })()}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Text className="text-sm font-semibold">
                  {getBrowserName(currentSession.userAgent)}
                </Text>

                <span className="text-muted-foreground">•</span>

                <Text className="text-sm text-muted-foreground">
                  {getOperatingSystem(currentSession.userAgent)}
                </Text>

                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                  <ShieldCheck className="size-3 text-primary" />

                  <Text className="text-[10px] font-semibold text-primary">
                    Current Session
                  </Text>
                </div>
              </div>

              <Text className="mt-2 text-xs text-muted-foreground">
                IP: {currentSession.ipAddress ?? "Unavailable"}
              </Text>

              <Text className="mt-1 text-xs text-muted-foreground">
                Last active: {formatDate(currentSession.updatedAt)}
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          OTHER SESSIONS
      ====================================== */}

      {otherSessions.length > 0 ? (
        <div className="space-y-3">
          <Text className="text-sm font-medium">Other Sessions</Text>

          {otherSessions.map((session) => {
            const Icon = getDeviceIcon(session.userAgent);

            const isRevoking = revokingToken === session.token;

            return (
              <div
                key={session.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Text className="text-sm font-semibold">
                          {getBrowserName(session.userAgent)}
                        </Text>

                        <span className="text-muted-foreground">•</span>

                        <Text className="text-sm text-muted-foreground">
                          {getOperatingSystem(session.userAgent)}
                        </Text>
                      </div>

                      <Text className="mt-2 text-xs text-muted-foreground">
                        IP: {session.ipAddress ?? "Unavailable"}
                      </Text>

                      <Text className="mt-1 text-xs text-muted-foreground">
                        Last active: {formatDate(session.updatedAt)}
                      </Text>
                    </div>
                  </div>

                  {/* SIGN OUT */}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(session.token)}
                    disabled={isRevoking || isRevokingOthers}
                    aria-disabled={isRevoking || isRevokingOthers}
                  >
                    <LogOut />

                    {isRevoking ? "Signing Out..." : "Sign Out"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-5">
          <Text className="text-sm text-muted-foreground">
            No other active sessions were found.
          </Text>
        </div>
      )}

      {/* =====================================
          SIGN OUT OTHER SESSIONS
      ====================================== */}

      {otherSessions.length > 0 && (
        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleRevokeOthers}
            disabled={isRevokingOthers || revokingToken !== null}
            aria-disabled={isRevokingOthers || revokingToken !== null}
          >
            <Globe />

            {isRevokingOthers ? "Signing Out..." : "Sign Out Other Sessions"}
          </Button>
        </div>
      )}
    </div>
  );
}
