"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { AprovePropertyAdmin, rejectPropertyAdmin } from "@/lib/actions/admin";

const TABS = ["pending", "approved", "rejected"];

export default function PropertyManagement({ properties }) {

  async function handleApprove(propertyId) {
    const result = await AprovePropertyAdmin(propertyId);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  }  
    async function handleReject(propertyId) {
      const result = await rejectPropertyAdmin(propertyId);
      if (!result.success) {
        alert(`Error: ${result.error}`);
      }
    }  

  const [tab, setTab] = useState("pending");
  const rows = properties.filter((p) => p.status === tab);

  return (
    <div className="flex flex-col gap-5">
      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const count = properties.filter((p) => p.status === t).length;
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
              {[
                "Property",
                "Category",
                "Host",
                "Price",
                "Submitted",
                "Status",
                "",
              ].map((h, i) => (
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
            {rows.length === 0 && (
              <tr className="border-t border-[#FBDFC5]/10">
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-[#FBDFC5]/50"
                >
                  No {tab} properties.
                </td>
              </tr>
            )}

            {rows.map((p) => (
              <tr key={p.id} className="border-t border-[#FBDFC5]/10">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#FBDFC5]">
                    {p.title}
                  </p>
                  <p className="text-xs text-[#FBDFC5]/50">{p.location}</p>
                </td>
                <td className="px-5 py-4 text-sm text-[#FBDFC5]/70">
                  {p.category}
                </td>
                <td className="px-5 py-4 text-sm text-[#FBDFC5]/70">
                  {p.host}
                </td>
                <td className="px-5 py-4 text-sm text-[#FBDFC5]/70">
                  ${p.pricePerNight}
                </td>
                <td className="px-5 py-4 text-sm text-[#FBDFC5]/70">
                  {p.submittedAt}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/property/${p.id}`}
                      className="px-2 text-xs font-semibold text-[#FBDFC5]/60 hover:text-[#FBDFC5]"
                    >
                      View
                    </Link>
                    {p.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => handleApprove(p.id)}
                        className="rounded-full bg-[#CA6200] px-4 py-2 text-xs font-bold text-[#FBDFC5] transition-opacity hover:opacity-90"
                      >
                        Approve
                      </button>
                    )}
                    {p.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleReject(p.id)}
                        className="rounded-full border border-[#FBDFC5]/40 px-4 py-2 text-xs font-bold text-[#FBDFC5] transition-colors hover:bg-white hover:text-black"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
