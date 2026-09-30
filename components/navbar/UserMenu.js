"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";

export default function UserMenu({ name, email, isAdmin = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const initial = (name?.trim()?.[0] || email?.[0] || "?").toUpperCase();

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const sections = [
    {
      title: "Traveling",
      items: [
        { href: "/bookings", label: "My trips" },
        { href: "/profile", label: "Profile" },
      ],
    },
    {
      title: "Hosting",
      items: [
        { href: "/host/properties", label: "My listings" },
        { href: "/host/requests", label: "Booking requests" },
        { href: "/property/new", label: "List a property" },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Admin",
            items: [{ href: "/admin/properties", label: "Review listings" }],
          },
        ]
      : []),
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-[#FBDFC5]/10"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CA6200] text-sm font-bold text-[#FBDFC5]">
          {initial}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 text-[#FBDFC5]/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#FBDFC5]/10 bg-[#1f1710] shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="border-b border-[#FBDFC5]/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#FBDFC5]">
              {name || "Your account"}
            </p>
            {email && (
              <p className="truncate text-xs text-[#FBDFC5]/50">{email}</p>
            )}
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div
              key={section.title}
              className="border-b border-[#FBDFC5]/10 py-2"
            >
              <p className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#FBDFC5]/30">
                {section.title}
              </p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-[#FBDFC5]/80 transition-colors hover:bg-[#17110C] hover:text-[#FBDFC5]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          {/* Sign out */}
          <form action={signOutAction} className="py-2">
            <button
              type="submit"
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-[#17110C]"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
