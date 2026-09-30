"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import SubmitButton from "./Submitbutton";
import { useActionState } from "react";


const initialState = { error: null };

export default function SignInForm({ next = "/" }) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <div className="mx-auto w-full max-w-lg rounded-[1.75rem]  border border-[#FBDFC5]/10 bg-[#1f1710]/40 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
      <h1 className="text-2xl font-semibold text-[#FBDFC5]">Welcome back</h1>
      <p className="mt-1 text-sm text-[#FBDFC5]/50">
        Log in to Become a Host or book your next stay.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
          />
        </div>

        {state?.error && (
          <p className="text-sm font-medium text-red-400">{state.error}</p>
        )}

        <SubmitButton pendingText="Logging in...">Log in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[#FBDFC5]/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#CA6200]">
          Sign up
        </Link>
      </p>
    </div>
  );
}
