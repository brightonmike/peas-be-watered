import type { WeatherData } from "@/lib/types";

function rainIcon(mm: number): string {
  if (mm < 1) return "☀️";
  if (mm < 5) return "🌦️";
  if (mm < 15) return "🌧️";
  return "⛈️";
}

function dayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short" });
}

export default function RainForecast({ weather }: { weather: WeatherData }) {
  const days = [weather.today, ...weather.forecast].slice(0, 6);

  return (
    <div className="mt-5 border-t border-current/10 pt-5">
      <div className="flex gap-1">
        {days.map((day, i) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-current opacity-50">
              {dayLabel(day.date, i)}
            </span>
            <span className="text-xl leading-none">{rainIcon(day.rainMm)}</span>
            <span className="text-[10px] text-current opacity-50">
              {day.rainMm >= 1 ? `${Math.round(day.rainMm)}mm` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
