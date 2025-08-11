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
  moderator: "/moderator/dashboard",
  user: "/user/dashboard",
  admin: "/admin/dashboard",
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
      const session = await getSession();
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 text-white px-4 py-8">
      {isPending && <Loader />}
      <div className="absolute top-1/5 left-1/3 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl max-sm:text-xl font-bold font-michroma text-orange-600">
            Welcome Back
          </h2>
          <p className="text-sm text-white/80 font-tektur">
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
              email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60"
              placeholder="you@nist.edu"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with show/hide toggle */}
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
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 cursor-pointer bg-white text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-michroma"
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

        <p className="text-sm text-white/80 text-center mt-6 font-tektur">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-orange-600 underline font-bold">
            Sign Up
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/70 border-b-1 hover:text-white font-tektur"
          >
            ← Go back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
