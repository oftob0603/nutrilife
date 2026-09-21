"use client";

import { useSyncExternalStore } from "react";

function tarmoqqaObuna(xabar: () => void) {
  window.addEventListener("online", xabar);
  window.addEventListener("offline", xabar);
  return () => {
    window.removeEventListener("online", xabar);
    window.removeEventListener("offline", xabar);
  };
}

/** Brauzerning tarmoq holati. Serverda va birinchi chizishda — onlayn deb olinadi. */
export function useOnlayn(): boolean {
  return useSyncExternalStore(
    tarmoqqaObuna,
    () => navigator.onLine,
    () => true,
  );
}
