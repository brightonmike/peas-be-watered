import "server-only";
import { cookies } from "next/headers";
import type { UserPrefs } from "@/lib/types";

const COOKIE_NAME = "croppy_prefs";

export async function getPrefsFromCookie(): Promise<UserPrefs | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed.postcode === "string" && Array.isArray(parsed.crops)) {
      return parsed as UserPrefs;
    }
    return null;
  } catch {
    return null;
  }
}
