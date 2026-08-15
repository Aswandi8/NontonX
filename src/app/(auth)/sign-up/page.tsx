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
   SIGN UP SCHEMA
========================================= */

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Please enter a valid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* =========================================
   TYPE
========================================= */

type SignupFormData = z.infer<typeof signupSchema>;

/* =========================================
   PAGE
========================================= */

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/sign-in",
      });

      /* =====================================
         BETTER AUTH ERROR
      ===================================== */

      if (error) {
        console.error("Sign up error:", error);

        toast.error(error.message || "Unable to create your account.");

        return;
      }

      /* =====================================
         SUCCESS
      ===================================== */

      toast.success("Account created successfully!");

      router.push("/sign-in");
    } catch (error) {
      /* =====================================
         UNEXPECTED ERROR
      ===================================== */

      console.error("Sign up error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <FormLayout title="Create an account" subTitle="Sign up to get started">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* =====================================
            NAME
        ====================================== */}

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
            aria-invalid={!!errors.name}
          />

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            placeholder="********"
            autoComplete="new-password"
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
            CONFIRM PASSWORD
        ====================================== */}

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>

          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />

          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* =====================================
            SUBMIT BUTTON
        ====================================== */}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
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
        Already have an account? <Link href="/sign-in">Sign In</Link>
      </div>
    </FormLayout>
  );
}
