"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CROPS, CROP_CATEGORIES, CROP_MAP } from "@/lib/crops";
import { ROOTS_LOCATIONS, ROOTS_LOCATION_MAP } from "@/lib/roots-locations";
import { savePrefsToClientCookie } from "@/lib/cookies.client";
import type { UserPrefs } from "@/lib/types";
import { CropIcon } from "@/components/CropIcon";

const sectionEyebrow =
  "font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-root-live)]/85";

const fieldLabel =
  "font-serif italic text-[16px] text-[var(--color-cream)]/80";

function Pin() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true" className="flex-shrink-0">
      <path
        d="M7 1 c -3 0 -5 2 -5 5 c 0 3 5 9 5 9 s 5 -6 5 -9 c 0 -3 -2 -5 -5 -5 z"
        fill="none"
        stroke="var(--color-root-live)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="6" r="1.6" fill="var(--color-root-live)" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="pointer-events-none">
      <path d="M3 5 l 4 4 l 4 -4" stroke="var(--color-cream)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function CheckPip({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span
      className="absolute top-2 right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full"
      style={{ background: "var(--color-root-live)" }}
      aria-hidden="true"
    >
      <svg width="10" height="10" viewBox="0 0 12 12">
        <path d="M2 6 l 3 3 l 5 -6" stroke="var(--color-soil-deep)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function SetupForm({ initial }: { initial?: UserPrefs }) {
  const router = useRouter();

  const [rootsLocationId, setRootsLocationId] = useState<string>(initial?.rootsLocationId ?? "");
  const [postcode, setPostcode] = useState(initial?.postcode ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initial?.crops ?? []));

  const selectedLocation = rootsLocationId ? ROOTS_LOCATION_MAP.get(rootsLocationId) : null;
  const effectivePostcode = selectedLocation?.postcode ?? postcode;
  const effectiveCity = selectedLocation?.city ?? "";

  const selectedCrops = Array.from(selectedIds)
    .flatMap((id) => CROP_MAP.get(id) ?? [])
    .sort((a, b) => CROPS.findIndex((c) => c.id === a.id) - CROPS.findIndex((c) => c.id === b.id));

  function toggleCrop(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      ...(initial?.soil ? { soil: initial.soil } : {}),
    };
    savePrefsToClientCookie(prefs);
    router.push("/");
    router.refresh();
  }

  const canSubmit = effectivePostcode.trim() && selectedIds.size > 0;
  const totalCrops = CROPS.length;

  return (
    <form onSubmit={handleSubmit}>
      {/* Bed strip — full-width, plants standing on the soil line */}
      <div
        className="w-full"
        style={{
          background: `linear-gradient(180deg, var(--color-soil-top) 0%, var(--color-soil-mid) 75%, var(--color-soil-deep) 100%)`,
        }}
      >
        <div className="mx-auto max-w-lg relative">
          {selectedCrops.length === 0 ? (
            <div className="px-5 py-7">
              <p className="font-serif italic text-[14px] text-[var(--color-cream)]/65">
                An empty bed. Drop some seeds below.
              </p>
            </div>
          ) : (
            <div
              className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex items-end gap-4 px-5 pt-3 pb-10 min-w-max">
                {selectedCrops.map((c) => (
                  <div key={c.id} className="flex-shrink-0">
                    <CropIcon name={c.name} size={36} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="absolute bottom-0 right-[20px]">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase rounded-full px-3 py-1 bg-[var(--color-cream)] text-[var(--color-soil-deep)]">
              {selectedCrops.length} planted
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 pt-7 pb-6 flex flex-col gap-6">

        {/* Where the rain falls — section box */}
        <div
          className="rounded-2xl px-5 py-5 flex flex-col gap-4"
          style={{
            background: "rgba(255, 246, 229, 0.04)",
            border: "1px solid rgba(168, 184, 155, 0.18)",
          }}
        >
          <p className={sectionEyebrow}>Where the rain falls</p>

          <div className="flex flex-col gap-2">
            <label htmlFor="roots-location" className={fieldLabel}>
              Roots Allotments site{" "}
              <span className="text-[var(--color-cream)]/40 not-italic font-sans text-[13px]">· optional</span>
            </label>
            <div className="relative">
              <select
                id="roots-location"
                value={rootsLocationId}
                onChange={(e) => setRootsLocationId(e.target.value)}
                className="w-full appearance-none rounded-xl px-4 py-3 pr-10 font-serif italic text-[15px] text-[var(--color-cream)] focus:outline-none focus:ring-2 focus:ring-[var(--color-root-live)]/40"
                style={{
                  background: "rgba(63, 122, 63, 0.12)",
                  border: "1px solid rgba(63, 122, 63, 0.4)",
                }}
              >
                <option value="">— Not a Roots site —</option>
                {ROOTS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.siteName}, {loc.city}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Chevron />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="postcode" className={fieldLabel}>
              Postcode
            </label>
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 relative"
              style={{
                background: "rgba(63, 122, 63, 0.12)",
                border: "1px solid rgba(63, 122, 63, 0.4)",
              }}
            >
              <Pin />
              <input
                id="postcode"
                type="text"
                value={selectedLocation ? selectedLocation.postcode : postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. SW16"
                autoComplete="postal-code"
                disabled={!!selectedLocation}
                className="flex-1 bg-transparent font-mono text-[18px] tracking-wider text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 focus:outline-none disabled:opacity-90"
                required={!selectedLocation}
              />
              {effectiveCity && (
                <span className="font-serif italic text-[14px] text-[var(--color-cream)]/55 whitespace-nowrap absolute right-0 top-0 h-full flex items-center px-4 pointer-events-none">
                  {effectiveCity}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Drop seeds — section box with crop tile grid */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{
            background: "rgba(255, 246, 229, 0.04)",
            border: "1px solid rgba(168, 184, 155, 0.18)",
          }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <p className={sectionEyebrow}>Drop seeds in the row</p>
            <span className="font-mono text-[10px] tracking-wider text-[var(--color-root-live)]/70">
              {selectedIds.size} of {totalCrops}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {CROP_CATEGORIES.map((category) => {
              const crops = CROPS.filter((c) => c.category === category);
              if (crops.length === 0) return null;
              return (
                <div key={category} className="flex flex-col gap-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-cream)]/35">
                    {category}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {crops.map((crop) => {
                      const checked = selectedIds.has(crop.id);
                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => toggleCrop(crop.id)}
                          className="relative flex flex-col items-center justify-center gap-2 rounded-xl py-3 transition-colors text-center min-h-[88px]"
                          style={
                            checked
                              ? {
                                  background: "rgba(63, 122, 63, 0.18)",
                                  border: "1px solid rgba(63, 122, 63, 0.55)",
                                }
                              : {
                                  background: "transparent",
                                  border: "1px dashed rgba(168, 184, 155, 0.28)",
                                }
                          }
                        >
                          <CheckPip visible={checked} />
                          <div style={{ opacity: checked ? 1 : 0.45 }}>
                            <CropIcon name={crop.name} size={32} />
                          </div>
                          <span
                            className="font-sans text-[11px] leading-none px-1 truncate max-w-full"
                            style={{
                              color: checked
                                ? "var(--color-cream)"
                                : "rgba(255, 246, 229, 0.45)",
                            }}
                          >
                            {crop.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sticky submit — pinned to viewport bottom while scrolling, lands in
          place at the end of the form */}
      <div
        className="sticky bottom-0 z-20 w-full"
        style={{
          background: "linear-gradient(180deg, rgba(27,19,12,0) 0%, rgba(27,19,12,0.92) 30%, rgba(27,19,12,1) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="mx-auto max-w-lg px-5 pt-6 pb-5 flex flex-col gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-2xl bg-[var(--color-leaf-deep)] px-6 py-4 font-sans text-[15px] font-medium text-[var(--color-cream)] transition-opacity hover:opacity-90 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Read the soil →
          </button>
          <p className="text-center font-sans text-[12px] italic text-[var(--color-cream)]/55">
            We&apos;ll pull 7 days back, 5 ahead — for your soil.
          </p>
        </div>
      </div>
    </form>
  );
}
