"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInInput } from "@/zodSchemas/signInSchema";
import { useMutation } from "@tanstack/react-query";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const roleRouteMap: Record<string, string> = {
  MODERATOR: "/moderator/dashboard",
  USER: "/user/dashboard",
  ADMIN: "/admin/dashboard",
};

export default function SignInPage() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignInInput) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!res?.ok) throw new Error(res?.error ?? "Invalid email or password");

      toast.success("Signed in successfully");
      const session: any = await getSession();
      const role = session?.user?.role || "intruder";
      router.push(roleRouteMap[role] || "/unauthorized");
    },
    onError: (error: any) => {
      setFormError(error.message);
      toast.error(error.message);
    },
  });

  if (!isMounted) return null;

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-50 to-white text-gray-900 px-4 py-8">
      {isPending && <Loader />}

      {/* Decorative blurred shapes */}
      <div className="absolute top-1/5 left-1/3 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-lg bg-white border border-orange-100 shadow-2xl p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl max-sm:text-xl font-bold font-michroma text-orange-600">
            Good to See You Again!
          </h2>
          <p className="text-sm text-gray-600 font-tektur">
            Sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="space-y-6"
          noValidate
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-tektur mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="you@nist.edu"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-tektur mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 pr-10 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-michroma"
          >
            {isPending ? (
              "Signing In..."
            ) : (
              <>
                <span>Sign In</span> <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6 font-tektur">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-orange-600 underline font-bold">
            Sign Up
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 font-tektur"
          >
            ← Go back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
