import UserHeader from "@/components/User/Header";
import React from "react";

const userLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
};

export default userLayout;
