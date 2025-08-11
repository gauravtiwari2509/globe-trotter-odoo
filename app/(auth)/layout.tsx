import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (session) {
    const role = session.user.role;
    const roleRouteMap: Record<string, string> = {
      USER: "/user/dashboard",
      ADMIN: "/admin/dashboard",
      MODERATOR: "/moderator/dashboard",
    };
    redirect(roleRouteMap[role] || "/unauthorized");
  }
  return <>{children}</>;
};

export default AuthLayout;
