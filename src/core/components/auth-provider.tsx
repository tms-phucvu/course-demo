"use client";

import { setAccessToken } from "@/core/lib/api-client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setAccessToken(session.user.accessToken ?? null);
    } else if (status === "unauthenticated") {
      setAccessToken(null);
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black' />
      </div>
    );
  }

  return <>{children}</>;
}
