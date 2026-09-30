"use client";

import { useState, useTransition } from "react";
import BookingCalendarPanel from "./BookingCalendarPanel";
import { createBookingAction } from "@/lib/actions/booking";

function parseDateString(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(str) {
  if (!str) return "";
  return parseDateString(str).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function BookingCard({ propertyId, pricePerNight }) {
  
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSelect(newCheckIn, newCheckOut) {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    if (newCheckIn && newCheckOut) {
      setPanelOpen(false); // both picked — collapse the calendar
    }
  }

  function handleReserve() {
    if (!checkIn || !checkOut) {
      setReserveError("Please select check-in and check-out dates.");
      return;
    }

    setReserveError(null);
    startTransition(async () => {
      const result = await createBookingAction(propertyId, checkIn, checkOut);
      if (result.error) {
        setReserveError(result.error);
      } else {
        setReserveSuccess(true);
      }
    });
  }

  const nights =
    checkIn && checkOut
      ? Math.round(
          (parseDateString(checkOut) - parseDateString(checkIn)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const serviceFee = nights > 0 ? 25 : 0;
  const total = pricePerNight * nights + serviceFee;

  return (
    <div className="sticky top-28 rounded-[1.5rem] bg-[#1f1710] p-6">
      <p className="text-lg font-semibold text-[#FBDFC5]">
        ${pricePerNight}{" "}
        <span className="text-sm font-normal text-[#FBDFC5]/50">/ night</span>
      </p>

      <div className="mt-4 grid gap-2 rounded-2xl border border-[#FBDFC5]/10 p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="rounded-xl px-3 py-2 text-left hover:bg-[#17110C]"
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#FBDFC5]/40">
              Check-in
            </span>
            <span className="block text-sm font-medium text-[#FBDFC5]">
              {checkIn ? formatDisplayDate(checkIn) : "Add date"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="rounded-xl px-3 py-2 text-left hover:bg-[#17110C]"
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#FBDFC5]/40">
              Check-out
            </span>
            <span className="block text-sm font-medium text-[#FBDFC5]">
              {checkOut ? formatDisplayDate(checkOut) : "Add date"}
            </span>
          </button>
        </div>

        <div className="rounded-xl px-3 py-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FBDFC5]/40">
            Guests
          </label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm font-medium text-[#FBDFC5] outline-none"
          />
        </div>
      </div>

      {panelOpen && (
        <BookingCalendarPanel
          propertyId={propertyId}
          checkIn={checkIn}
          checkOut={checkOut}
          onSelect={handleSelect}
        />
      )}

      <button
        type="button"
        onClick={handleReserve}
        disabled={isPending || !checkIn || !checkOut}
        className="mt-4 w-full rounded-full bg-[#CA6200] py-3 text-sm font-bold text-[#FBDFC5] transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isPending ? "Sending request..." : "Reserve"}
      </button>

      {reserveError && (
        <p className="mt-2 text-center text-xs text-red-400">{reserveError}</p>
      )}
      {reserveSuccess && (
        <p className="mt-2 text-center text-xs text-green-400">
          Request sent — the host will review it shortly.
        </p>
      )}

      <p className="mt-3 text-center text-xs text-[#FBDFC5]/40">
        You won&apos;t be charged yet — the host reviews your request first.
      </p>

      {nights > 0 && (
        <div className="mt-5 flex flex-col gap-2 border-t border-[#FBDFC5]/10 pt-4 text-sm text-[#FBDFC5]/70">
          <div className="flex justify-between">
            <span>
              ${pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${pricePerNight * nights}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between border-t border-[#FBDFC5]/10 pt-2 text-sm font-semibold text-[#FBDFC5]">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
