import type { UserPrefs } from "@/lib/types";

const COOKIE_NAME = "croppy_prefs";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function savePrefsToClientCookie(prefs: UserPrefs): void {
  const value = encodeURIComponent(JSON.stringify(prefs));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearPrefsCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
