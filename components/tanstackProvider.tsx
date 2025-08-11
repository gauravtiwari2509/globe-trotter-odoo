"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSX, ReactNode, useState } from "react";

interface TanstackProvidersProps {
  children: ReactNode;
}

export function TanstackProvider({
  children,
}: TanstackProvidersProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
