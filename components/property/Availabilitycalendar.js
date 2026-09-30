"use client";

import { useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Dummy: month starts on a Saturday (index 6), has 31 days
const MONTH_LABEL = "March 2025";
const DAYS_IN_MONTH = 31;
const START_OFFSET = 6;
const AVAILABLE_DAYS = [
  2, 3, 4, 7, 8, 9, 10, 14, 15, 16, 17, 21, 22, 23, 24, 28, 29, 30, 31,
];

export default function AvailabilityCalendar() {
  const [selectedDay, setSelectedDay] = useState(null);

  function handleDateSelect(day) {
    // TODO: wire up real availability + date-range selection logic
    setSelectedDay(day);
  }

  const cells = Array.from({ length: START_OFFSET }, () => null).concat(
    Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  );

  return (
    <div className="rounded-[1.5rem] bg-[#1f1710] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#FBDFC5]">{MONTH_LABEL}</h3>
        <span className="flex items-center gap-2 text-xs text-[#FBDFC5]/50">
          <span className="h-2 w-2 rounded-full bg-[#CA6200]" /> Available
        </span>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAYS.map((day, i) => (
          <span
            key={day + i}
            className="text-xs font-semibold text-[#FBDFC5]/40"
          >
            {day}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;

          const isAvailable = AVAILABLE_DAYS.includes(day);
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              type="button"
              disabled={!isAvailable}
              onClick={() => handleDateSelect(day)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-[#CA6200] text-[#FBDFC5]"
                  : isAvailable
                    ? "text-[#FBDFC5] hover:bg-[#CA6200]/20"
                    : "text-[#FBDFC5]/20 line-through"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
