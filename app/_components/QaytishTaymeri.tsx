"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** E8: hech narsa bosilmasa, to'rt soniyadan keyin Home'ga qaytadi (prototip `AddedScreen`). */
export function QaytishTaymeri({ kechikish = 4000 }: { kechikish?: number }) {
  const router = useRouter();

  useEffect(() => {
    const taymer = setTimeout(() => router.push("/"), kechikish);
    return () => clearTimeout(taymer);
  }, [router, kechikish]);

  return null;
}
