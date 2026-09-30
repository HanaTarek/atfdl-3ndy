"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
  { label: "Users", href: "/admin/users" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col">
      {ADMIN_LINKS.map(({ label, href }) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors lg:rounded-xl ${
              active
                ? "bg-[#CA6200] text-[#FBDFC5]"
                : "text-[#FBDFC5]/60 hover:bg-[#1f1710] hover:text-[#FBDFC5]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
