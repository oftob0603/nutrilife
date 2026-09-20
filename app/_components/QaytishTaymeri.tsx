"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** E8: hech narsa bosilmasa, ikki soniyadan keyin Home'ga qaytadi. */
export function QaytishTaymeri({ kechikish = 2000 }: { kechikish?: number }) {
  const router = useRouter();

  useEffect(() => {
    const taymer = setTimeout(() => router.push("/"), kechikish);
    return () => clearTimeout(taymer);
  }, [router, kechikish]);

  return null;
}
