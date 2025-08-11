"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInput, signUpSchema } from "@/zodSchemas/signUpSchema";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "@/lib/routes/routes";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

type SignupResponse = {
  message: string;
  userId: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignUpInput) =>
      axios.post<SignupResponse>(API_ROUTES.AUTH.SIGNUP, {
        ...data,
        role: "general_user",
      }),
    onSuccess: (res) => {
      const { userId, message } = res.data;
      if (message.includes("created")) {
        toast.success("Account created. OTP sent to your email.");
      } else if (message.includes("OTP already sent")) {
        toast.info("OTP already sent. Please check your inbox.");
      } else if (message.includes("expired")) {
        toast.info("Previous OTP expired. New OTP sent.");
      } else if (message.includes("already verified")) {
        toast.warning("You already have an account. Please sign in.");
        return router.push("/signin");
      } else {
        toast.info(message);
      }
      if (userId) {
        router.push(`/verify-otp?userId=${userId}`);
      }
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      const errorMsg = err?.response?.data?.error || "Something went wrong.";
      if (status === 409) {
        toast.warning("Account already exists. Please sign in.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(errorMsg);
      }
    },
  });

  const onSubmit = (data: SignUpInput) => {
    mutate(data);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-50 to-white text-gray-900 px-4 py-8">
      {/* Decorative blurred shapes */}
      <div className="absolute top-1/6 max-md:left-1 left-1/5 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white shadow-2xl p-6 sm:p-8 md:p-10 rounded-2xl border border-orange-100">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-michroma text-orange-600">
            Create Your Account
          </h2>
          <p className="text-xs mt-2 sm:text-sm text-gray-600 font-tektur">
            Excited to have you join our family!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          noValidate
        >
          {/* Full Name */}
          <div className="col-span-1">
            <label
              htmlFor="displayName"
              className="block text-sm font-tektur mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="displayName"
              {...register("displayName")}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="John Doe"
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label htmlFor="email" className="block text-sm font-tektur mb-1">
              Email (must be @gmail.com)
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="you@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="col-span-1">
            <label htmlFor="phoneNo" className="block text-sm font-tektur mb-1">
              Phone Number (10 digits)
            </label>
            <input
              type="tel"
              id="phoneNo"
              {...register("phoneNo")}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="1234567890"
            />
            {errors.phoneNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNo.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="col-span-1">
            <label
              htmlFor="password"
              className="block text-sm font-tektur mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex items-center gap-1 mt-1 text-sm cursor-pointer text-gray-500 hover:text-gray-700 select-none"
            >
              {!showPassword ? (
                <>
                  <span>show</span> <FaEye />
                </>
              ) : (
                <>
                  <span>hide</span> <FaEyeSlash />
                </>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="col-span-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-tektur mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-michroma"
            >
              {isPending ? (
                "Signing Up..."
              ) : (
                <>
                  <span>Sign Up</span> <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-xs sm:text-sm text-gray-600 text-center mt-6 font-tektur">
          Already have an account?{" "}
          <Link href="/signin" className="text-orange-600 underline font-bold">
            Sign In
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-tektur"
          >
            ← Go back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
