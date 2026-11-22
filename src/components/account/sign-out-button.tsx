"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { signOut } from "@/lib/auth-client";
import { cx } from "@/lib/cx";

/** Ends the session, then re-renders the server tree as signed out. */
export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOut();
          router.refresh();
        })
      }
      className={cx("cursor-pointer text-left disabled:cursor-wait disabled:text-subtle", className)}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
