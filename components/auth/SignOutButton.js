"use client";

import { useFormStatus } from "react-dom";

export default function SignOutButton({ className = "" }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`text-sm font-medium text-[#FBDFC5]/70 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
