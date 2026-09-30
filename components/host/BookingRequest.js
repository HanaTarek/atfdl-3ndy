"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "../admin/StatusBadge";
import { approveRequestAction, AproveRequestsHost, rejectRequestsHost } from "@/lib/actions/hosts";

const TABS = ["pending", "accepted", "rejected", "cancelled"];
const HEADERS = [
  "Property",
  "Guest",
  "Stay",
  "Nights",
  "Total",
  "Requested",
  "Status",
  "",
];

// Parse "YYYY-MM-DD" as a local date, so it doesn't shift a day in some timezones
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(str) {
  return parseDate(str).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function nightsBetween(checkIn, checkOut) {
  return Math.round((parseDate(checkOut) - parseDate(checkIn)) / 86400000);
}

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-400",
  accepted: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  cancelled: "bg-[#FBDFC5]/10 text-[#FBDFC5]/50",
};


export default function BookingRequest({ requests }) {

  async function handleApprove(BookingId) {
    const result = await approveRequestAction(BookingId);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  }
  async function handleReject(BookingId) {
    const result = await rejectRequestsHost(BookingId);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  }

  const [tab, setTab] = useState("pending");
  const rows = requests.filter((p) => p.status === tab);

  return (
    <div className="flex flex-col gap-5">
      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const count = requests.filter((p) => p.status === t).length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-[#CA6200] text-[#FBDFC5]"
                  : "bg-[#1f1710] text-[#FBDFC5]/60 hover:text-[#FBDFC5]"
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-[#1f1710]">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr>
              {HEADERS.map((h, i) => (
                <th
                  key={i}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((request) => {
              const nights = nightsBetween(request.check_in, request.check_out);

              return (
                <tr key={request.id} className="border-t border-[#FBDFC5]/10">
                  {/* Property */}
                  <td className="px-5 py-4 text-sm font-semibold text-[#FBDFC5]">
                    {request.properties?.title}
                  </td>

                  {/* Guest */}
                  <td className="px-5 py-4 text-sm text-[#FBDFC5]/80">
                    {request.guest?.full_name ?? "Unknown guest"}
                  </td>

                  {/* Stay: check-in → check-out */}
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-[#FBDFC5]/80">
                    {formatDate(request.check_in)} →{" "}
                    {formatDate(request.check_out)}
                  </td>

                  {/* Nights */}
                  <td className="px-5 py-4 text-sm text-[#FBDFC5]/80">
                    {nights}
                  </td>

                  {/* Total, with the nightly rate underneath */}
                  <td className="px-5 py-4 text-sm">
                    <span className="font-semibold text-[#FBDFC5]">
                      ${request.total_price}
                    </span>
                    <span className="block text-xs text-[#FBDFC5]/40">
                      ${request.price_per_night} / night
                    </span>
                  </td>

                  {/* Requested on */}
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-[#FBDFC5]/60">
                    {new Date(request.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        STATUS_STYLES[request.status] ?? ""
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  {/* Actions: only pending requests can be decided */}
                  <td className="px-5 py-4">
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(request.id)}
                          className="rounded-full bg-green-600/80 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(request.id)}
                          className="rounded-full bg-red-600/80 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
