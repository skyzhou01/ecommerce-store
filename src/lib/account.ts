/**
 * Server-side account reads. These read the request's session cookie, so
 * callers must render behind a `<Suspense>` boundary under Cache Components.
 */
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/** The narrow user shape pages need; never pass the raw session around. */
export type AccountUser = {
  name: string;
  email: string;
  memberSince: Date;
};

/** The signed-in shopper, or null when there is no valid session. */
export async function getAccountUser(): Promise<AccountUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { name, email, createdAt } = session.user;
  return { name, email, memberSince: createdAt };
}
