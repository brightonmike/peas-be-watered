import type { WeatherData } from "@/lib/types";

function rainIcon(mm: number): string {
  if (mm < 1) return "☀";
  if (mm < 5) return "🌦";
  if (mm < 15) return "🌧";
  return "⛈";
}

function dayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short" });
}

export default function RainForecast({ weather }: { weather: WeatherData }) {
  const days = [weather.today, ...weather.forecast].slice(0, 6);

  return (
    <div className="flex gap-1">
      {days.map((day, i) => (
        <div
          key={day.date}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 px-1"
          style={{ background: "rgba(255,246,229,0.55)", backdropFilter: "blur(6px)" }}
        >
          <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--color-ink)]/60">
            {dayLabel(day.date, i)}
          </span>
          <span className="text-base leading-none">{rainIcon(day.rainMm)}</span>
          <span className="font-mono text-[9px] text-[var(--color-ink)]/60">
            {day.rainMm >= 1 ? `${Math.round(day.rainMm)}mm` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
