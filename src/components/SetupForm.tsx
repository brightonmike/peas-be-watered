"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CROPS, CROP_CATEGORIES } from "@/lib/crops";
import { ROOTS_LOCATIONS, ROOTS_LOCATION_MAP } from "@/lib/roots-locations";
import { savePrefsToClientCookie } from "@/lib/cookies.client";
import type { UserPrefs } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20";

export default function SetupForm({ initial }: { initial?: UserPrefs }) {
  const router = useRouter();

  const [rootsLocationId, setRootsLocationId] = useState<string>(
    initial?.rootsLocationId ?? "",
  );
  const [postcode, setPostcode] = useState(initial?.postcode ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initial?.crops ?? []),
  );

  const selectedLocation = rootsLocationId
    ? ROOTS_LOCATION_MAP.get(rootsLocationId)
    : null;

  const effectivePostcode = selectedLocation?.postcode ?? postcode;

  function toggleCrop(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = effectivePostcode.trim().toUpperCase();
    if (!trimmed || selectedIds.size === 0) return;
    const prefs: UserPrefs = {
      postcode: trimmed,
      crops: Array.from(selectedIds),
      ...(rootsLocationId ? { rootsLocationId } : {}),
    };
    savePrefsToClientCookie(prefs);
    router.push("/");
    router.refresh();
  }

  const canSubmit = effectivePostcode.trim() && selectedIds.size > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* Roots Allotments location */}
      <div className="flex flex-col gap-2">
        <label htmlFor="roots-location" className="text-sm font-medium text-zinc-700">
          Roots Allotments site
          <span className="ml-1.5 text-xs font-normal text-zinc-400">optional</span>
        </label>
        <select
          id="roots-location"
          value={rootsLocationId}
          onChange={(e) => setRootsLocationId(e.target.value)}
          className={inputClass}
        >
          <option value="">— Not a Roots site —</option>
          {ROOTS_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.siteName}, {loc.city}
            </option>
          ))}
        </select>
      </div>

      {/* Postcode */}
      {!selectedLocation && (
        <div className="flex flex-col gap-2">
          <label htmlFor="postcode" className="text-sm font-medium text-zinc-700">
            Your postcode
          </label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. SW16"
            autoComplete="postal-code"
            className={inputClass}
            required={!selectedLocation}
          />
        </div>
      )}

      {/* Crop picker — flat list, category headings as dividers */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-zinc-700">
          Your crops
          {selectedIds.size > 0 && (
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {selectedIds.size} selected
            </span>
          )}
        </p>

        <div className="flex flex-col rounded-xl border border-zinc-200 bg-white">
          {CROP_CATEGORIES.map((category, catIndex) => {
            const crops = CROPS.filter((c) => c.category === category);
            return (
              <div key={category}>
                <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 ${catIndex > 0 ? "border-t border-zinc-100" : ""}`}>
                  {category}
                </p>
                {crops.map((crop) => {
                  const checked = selectedIds.has(crop.id);
                  return (
                    <label
                      key={crop.id}
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-50 active:bg-zinc-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCrop(crop.id)}
                        className="h-5 w-5 flex-shrink-0 accent-green-600"
                      />
                      <span className={`text-sm ${checked ? "font-medium text-green-700" : "text-zinc-700"}`}>
                        {crop.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-full bg-green-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-green-700 active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        See my recommendation →
      </button>
    </form>
  );
}
