"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Retry failed requests
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch settings
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            // Error handling
            throwOnError: false,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
