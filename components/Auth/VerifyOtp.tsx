"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpInput } from "@/zodSchemas/otpSchema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { API_ROUTES } from "@/lib/routes/routes";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      userId,
    },
  });

  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: async (data: OtpInput) =>
      axios.post(API_ROUTES.AUTH.VERIFY_OTP, data),
    onSuccess: (response) => {
      //@ts-ignore
      const message = response?.data?.message;
      if (message === "User is already verified.") {
        toast.info("You are already verified.");
      } else if (message === "OTP verified successfully.") {
        toast.success("OTP verified successfully!");
        router.push("/signin");
      }
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const errorMsg =
        error?.response?.data?.message || "Something went wrong.";

      if (status === 404) {
        toast.error("OTP verification failed. User not found or OTP missing.");
      } else if (status === 403) {
        if (errorMsg.includes("expired")) {
          toast.error("OTP expired. Please request a new one.");
        } else if (errorMsg.includes("Incorrect OTP")) {
          toast.error("Incorrect OTP. Please try again.");
        } else {
          toast.error(errorMsg);
        }
      } else {
        toast.error(errorMsg);
      }
    },
  });

  const onSubmit = (data: OtpInput) => {
    verifyOtp(data);
  };

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: async () => axios.post(API_ROUTES.AUTH.SEND_OTP, { userId }),
    onSuccess: (response) => {
      //@ts-ignore
      const message = response?.data?.message;
      if (message === "User is already verified.") {
        toast.info("You are already verified.");
      } else if (message === "OTP resent successfully.") {
        toast.success("OTP has been resent to your email.");
      } else {
        toast.success(message || "OTP request completed.");
      }
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const errorMsg =
        error?.response?.data?.message || "Something went wrong.";

      if (status === 400) {
        toast.error("User ID is required.");
      } else if (status === 404) {
        toast.error("User not found.");
      } else if (status === 500) {
        toast.error("Failed to resend OTP. Please try again.");
      } else {
        toast.error(errorMsg);
      }
    },
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {(isVerifying || isResending) && <Loader />}
      <div className="absolute top-1/5 left-1/3 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl max-sm:text-xl font-bold font-michroma text-orange-600">
            Verify Your OTP
          </h2>
          <p className="text-sm text-white/80 font-tektur">
            Enter the OTP sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register("userId")} />

          <div>
            <label htmlFor="otp" className="block text-sm font-tektur mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              maxLength={6}
              {...register("otp")}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60"
              placeholder="6-digit OTP"
            />
            {errors.otp && (
              <p className="text-red-400 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 cursor-pointer bg-white text-gray-900 font-bold rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-michroma"
          >
            {isVerifying || false ? (
              "Verifying..."
            ) : (
              <>
                <span>Verify OTP</span> <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/80 text-center mt-6 font-tektur">
            Didn’t receive an OTP?{" "}
            <button
              type="button"
              onClick={() => resendOtp()}
              disabled={isResending}
              className="text-orange-600 underline font-bold disabled:opacity-60 cursor-pointer"
            >
              {isResending || false ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        </div>

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
