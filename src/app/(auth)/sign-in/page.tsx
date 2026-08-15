"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

import FormLayout from "@/components/layouts/FormLayout";
import { Label, Link } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { authClient } from "@/lib/auth-client";

/* =========================================
   SIGN IN SCHEMA
========================================= */

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* =========================================
   TYPE
========================================= */

type SignInFormData = z.infer<typeof signInSchema>;

/* =========================================
   SIGN IN PAGE
========================================= */

export default function SignInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = async (data: SignInFormData) => {
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      /* =====================================
         AUTH ERROR
      ===================================== */

      if (error) {
        console.error("Sign in error:", error);

        const message = error.message?.toLowerCase() || "";

        /*
         * EMAIL BELUM VERIFIED
         */

        if (message.includes("verify") || message.includes("verification")) {
          toast.error("Please verify your email before signing in.");

          return;
        }

        /*
         * LOGIN GAGAL
         */

        toast.error(error.message || "Invalid email or password.");

        return;
      }

      /* =====================================
         LOGIN BERHASIL
      ===================================== */

      toast.success("Signed in successfully!");

      /*
       * Refresh server components supaya
       * session terbaru terbaca.
       */

      router.refresh();

      /*
       * Masuk ke dashboard
       */

      router.push("/dashboard");
    } catch (error) {
      console.error("Unexpected sign in error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <FormLayout title="Welcome back" subTitle="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* =====================================
            EMAIL
        ====================================== */}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* =====================================
            PASSWORD
        ====================================== */}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <Link href="/forgot-password">Forgot password?</Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="********"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* =====================================
            SIGN IN BUTTON
        ====================================== */}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* =====================================
          DIVIDER
      ====================================== */}

      <div className="my-6 flex items-center gap-2">
        <div className="h-px flex-1 bg-muted" />

        <span className="text-sm text-muted-foreground">or continue with</span>

        <div className="h-px flex-1 bg-muted" />
      </div>

      {/* =====================================
          SOCIAL LOGIN
      ====================================== */}

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          <FcGoogle />
          Google
        </Button>

        <Button type="button" variant="outline" disabled={isSubmitting}>
          <FaGithub />
          Github
        </Button>
      </div>

      {/* =====================================
          FOOTER
      ====================================== */}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
      </div>
    </FormLayout>
  );
}
