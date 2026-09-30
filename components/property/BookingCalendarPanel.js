"use client";

import { useState, useEffect, useCallback } from "react";
import { getBookedDates } from "@/lib/actions/booking";

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateString(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function BookingCalendarPanel({
  propertyId,
  checkIn,
  checkOut,
  onSelect,
}) {
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()));
  const [cache, setCache] = useState({}); // "YYYY-MM" -> { accepted: Set, pending: Set }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const monthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`;

  const fetchMonth = useCallback(
    async (month) => {
      const key = `${month.getFullYear()}-${month.getMonth()}`;
      setLoading(true);
      setError(null);
      try {
        const rangeStart = toDateString(startOfMonth(month));
        const rangeEnd = toDateString(startOfMonth(addMonths(month, 1)));
        const { accepted, pending } = await getBookedDates(
          propertyId,
          rangeStart,
          rangeEnd,
        );
        setCache((prev) => ({
          ...prev,
          [key]: { accepted: new Set(accepted), pending: new Set(pending) },
        }));
      } catch (err) {
        setError("Couldn't load availability. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [propertyId],
  );

  useEffect(() => {
    if (!cache[monthKey]) {
      fetchMonth(visibleMonth);
    }
  }, [monthKey, cache, fetchMonth, visibleMonth]);

  const monthData = cache[monthKey];

  function isPast(dateStr) {
    const today = toDateString(new Date());
    return dateStr < today;
  }

  function isAccepted(dateStr) {
    return monthData?.accepted.has(dateStr) ?? false;
  }

  function isPending(dateStr) {
    return monthData?.pending.has(dateStr) ?? false;
  }

  // Checks whether any day strictly between two dates (exclusive of the
  // endpoints) is an accepted (truly unavailable) booking — used to
  // block selecting a check-out that would span through a booked night.
  function rangeHasAcceptedConflict(startStr, endStr) {
    let cursor = parseDateString(startStr);
    const end = parseDateString(endStr);
    while (cursor < end) {
      const cursorStr = toDateString(cursor);
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
      const data = cache[key];
      if (data?.accepted.has(cursorStr)) return true;
      cursor = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate() + 1,
      );
    }
    return false;
  }

  function handleDayClick(dateStr) {
    if (isPast(dateStr) || isAccepted(dateStr)) return;

    // No check-in yet, or both dates already set — start a fresh selection
    if (!checkIn || (checkIn && checkOut)) {
      onSelect(dateStr, null);
      return;
    }

    // Clicked a date before or equal to the existing check-in — restart from here
    if (dateStr <= checkIn) {
      onSelect(dateStr, null);
      return;
    }

    // Clicked a valid check-out candidate — block it if it crosses a booked night
    if (rangeHasAcceptedConflict(checkIn, dateStr)) {
      setError(
        "That range crosses an already-booked date. Pick different dates.",
      );
      return;
    }

    setError(null);
    onSelect(checkIn, dateStr);
  }

  // Build the calendar grid for the visible month
  const firstOfMonth = startOfMonth(visibleMonth);
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="relative mt-3 rounded-2xl border border-[#FBDFC5]/10 bg-[#17110C] p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
          disabled={
            visibleMonth.getFullYear() === new Date().getFullYear() &&
            visibleMonth.getMonth() === new Date().getMonth()
          }
          className="rounded-full px-2 py-1 text-sm text-[#FBDFC5]/60 hover:text-[#FBDFC5] disabled:opacity-20"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-[#FBDFC5]">
          {visibleMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
          className="rounded-full px-2 py-1 text-sm text-[#FBDFC5]/60 hover:text-[#FBDFC5]"
        >
          →
        </button>
      </div>

      {/* Weekday header */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-[#FBDFC5]/30">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="relative mt-1 grid grid-cols-7 gap-1">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#17110C]/80 backdrop-blur-sm">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FBDFC5]/20 border-t-[#CA6200]" />
          </div>
        )}

        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />;

          const date = new Date(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth(),
            day,
          );
          const dateStr = toDateString(date);
          const past = isPast(dateStr);
          const accepted = isAccepted(dateStr);
          const pending = isPending(dateStr);
          const disabled = past || accepted;

          const inRange =
            checkIn && checkOut && dateStr >= checkIn && dateStr <= checkOut;
          const isRangeEndpoint = dateStr === checkIn || dateStr === checkOut;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleDayClick(dateStr)}
              disabled={disabled}
              className={`
                relative rounded-lg py-2 text-xs font-medium transition-colors
                ${disabled ? "cursor-not-allowed text-[#FBDFC5]/20" : "text-[#FBDFC5] hover:bg-[#FBDFC5]/10"}
                ${accepted ? "line-through decoration-dashed decoration-[#FBDFC5]/40" : ""}
                ${inRange ? "bg-[#CA6200]/25" : ""}
                ${isRangeEndpoint ? "bg-[#CA6200] text-[#FBDFC5] hover:bg-[#CA6200]" : ""}
              `}
            >
              {day}
              {pending && !accepted && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-yellow-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-[#FBDFC5]/40">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#CA6200]" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500" /> Requested
          (still open)
        </span>
        <span className="flex items-center gap-1 line-through decoration-dashed">
          12
        </span>
        <span>Booked</span>
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
