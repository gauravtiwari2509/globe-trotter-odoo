"use client";

import { SessionProvider } from "next-auth/react";

const ClientSessionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientSessionWrapper;
