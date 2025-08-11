"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-primary text-center p-6">
      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-lg p-10 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-body-col mb-6 font-roboto">
          You do not have permission to access this page.
        </p>

        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-orange-primary text-white rounded-full font-roboto font-semibold hover:bg-opacity-90 transition-all"
        >
          ← Go Back
        </button>

        <p className="mt-4 text-sm text-body-col">
          Or go to{" "}
          <Link href="/" className="text-orange-primary underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
