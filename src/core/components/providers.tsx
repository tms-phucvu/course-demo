"use client";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/core/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position='top-right' />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
