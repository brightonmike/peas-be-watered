import { cookies } from "next/headers";
import type { UserPrefs } from "@/lib/types";

const COOKIE_NAME = "croppy_prefs";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// --- Server-side (RSC / Server Actions) ---

export async function getPrefsFromCookie(): Promise<UserPrefs | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.postcode === "string" &&
      Array.isArray(parsed.crops)
    ) {
      return parsed as UserPrefs;
    }
    return null;
  } catch {
    return null;
  }
}

// --- Client-side helpers (used in setup form) ---

export function savePrefsToClientCookie(prefs: UserPrefs): void {
  const value = encodeURIComponent(JSON.stringify(prefs));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearPrefsCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
