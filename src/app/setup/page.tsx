import { getPrefsFromCookie } from "@/lib/cookies.server";
import SetupForm from "@/components/SetupForm";

export const metadata = {
  title: "Setup — Peas be Watered",
  description: "Enter your postcode and choose your crops.",
};

export default async function SetupPage() {
  const prefs = await getPrefsFromCookie();

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Set up Peas be Watered
        </h1>
        <p className="mt-2 text-zinc-500">
          Tell us where your allotment is and what you&apos;re growing.
        </p>
      </div>
      <SetupForm initial={prefs ?? undefined} />
    </main>
  );
}
