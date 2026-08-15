import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./prisma";
import { resend } from "./resend";

import VerificationEmail from "@/components/emails/verify-email";

export const auth = betterAuth({
  /* =========================================
     DATABASE
  ========================================= */

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  /* =========================================
     USER
  ========================================= */

  user: {
    /* =======================================
       CHANGE EMAIL
    ======================================== */

    changeEmail: {
      enabled: true,
    },

    /* =======================================
       ADDITIONAL FIELDS
    ======================================== */

    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        required: false,
        defaultValue: "USER",
        input: false,
        returned: true,
      },
    },
  },

  /* =========================================
     EMAIL & PASSWORD
  ========================================= */

  emailAndPassword: {
    enabled: true,

    requireEmailVerification: true,

    autoSignIn: false,
  },

  /* =========================================
     EMAIL VERIFICATION
  ========================================= */

  emailVerification: {
    /*
     * Kirim verification email ketika
     * user melakukan registrasi.
     */
    sendOnSignUp: true,

    /*
     * User tidak langsung login setelah
     * melakukan verification.
     */
    autoSignInAfterVerification: false,

    /*
     * Digunakan untuk:
     *
     * 1. Verify email saat signup
     * 2. Verify email baru ketika
     *    user melakukan Change Email
     */
    sendVerificationEmail: async ({ user, url }) => {
      console.log("Verification URL:", url);

      console.log("Send to:", user.email);

      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,

        to: user.email,

        subject: "Verify your NontonX email address",

        react: VerificationEmail({
          name: user.name,
          userEmail: user.email,
          verificationUrl: url,
        }),
      });
    },
  },
});
