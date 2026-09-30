"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../logo/Logo";
import UserMenu from "./UserMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/property" },
  { label: "Become a Host", href: "/property/new" },
  { label: "About", href: "/" },
];

const PILL_BUTTON =
  "rounded-full border border-[#FBDFC5] px-5 py-2 text-sm font-medium text-[#FBDFC5] transition-colors hover:bg-white hover:text-black";

export default function Navbar({ user, isAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Logo size="nav" />

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#FBDFC5] transition-opacity hover:opacity-75"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAdmin && (
            <Link href="/admin" className={PILL_BUTTON}>
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <UserMenu
              name={user.full_name}
              email={user.email}
              isAdmin={isAdmin}
            />
          ) : (
            <>
              <Link
                href="/signup"
                className="text-sm font-medium text-[#FBDFC5]/70 transition-colors hover:text-white"
              >
                Sign Up
              </Link>
              <Link href="/login" className={PILL_BUTTON}>
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Mobile: avatar menu + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            // Clicking the avatar area also closes the hamburger panel,
            // so the two menus never overlap.
            <div onClick={closeMenu}>
              <UserMenu
                name={user.full_name}
                email={user.email}
                isAdmin={isAdmin}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="flex flex-col gap-1.5"
          >
            <span
              className={`h-0.5 w-6 bg-white transition-transform ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition-opacity ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition-transform ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel: site links only (account stuff lives in the avatar menu) */}
      {isMenuOpen && (
        <div className="flex flex-col gap-6 bg-black/90 px-6 py-8 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-base font-medium text-white"
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <div className="mt-2 flex flex-col gap-4 border-t border-white/20 pt-6">
              <Link
                href="/signup"
                onClick={closeMenu}
                className="text-sm font-medium text-white/70"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                onClick={closeMenu}
                className="text-sm font-medium text-white/70"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
