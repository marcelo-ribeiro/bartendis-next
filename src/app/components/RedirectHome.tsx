"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const RedirectHome = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.back();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return null;
};
