import { DUMMY_FORECAST } from "@/util/data";


export default function WeatherWidget({ location }) {
  return (
    <div className="rounded-[1.5rem] bg-[#1f1710] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#FBDFC5]">
          Weather in {location}
        </h3>
        <span className="text-xs text-[#FBDFC5]/40">5-day forecast</span>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2 text-center">
        {DUMMY_FORECAST.map((day) => (
          <div key={day.day} className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-[#FBDFC5]/50">
              {day.day}
            </span>
            <span className="text-2xl">{day.icon}</span>
            <span className="text-sm font-semibold text-[#FBDFC5]">
              {day.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
