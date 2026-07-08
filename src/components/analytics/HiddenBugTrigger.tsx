"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

const REQUIRED_CLICKS = 5;
const RESET_MS = 3000;

export default function HiddenBugTrigger() {
  const router = useRouter();
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    countRef.current += 1;

    if (countRef.current >= REQUIRED_CLICKS) {
      countRef.current = 0;
      router.push("/login?callbackUrl=/dashboard");
      return;
    }

    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, RESET_MS);
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-hidden
      tabIndex={-1}
      className="mx-auto mt-3 block cursor-default text-[8px] leading-none opacity-[0.12] transition-opacity hover:opacity-30"
    >
      🐞
    </button>
  );
}
