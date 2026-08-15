import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./prisma";
import { resend } from "./resend";
import VerificationEmail from "@/components/emails/verify-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
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

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },

  emailVerification: {
    sendOnSignUp: true,

    // Jangan langsung login setelah verification
    autoSignInAfterVerification: false,

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
