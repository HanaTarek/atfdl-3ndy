"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signUpNewUser } from "@/lib/actions/auth";
import SubmitButton from "./Submitbutton";
import { useActionState } from "react";

const initialState = { error: null, success: false, message: null };

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUpNewUser, initialState);

  return (
    <div className="mx-auto w-full max-w-xl rounded-[1.75rem] border border-[#FBDFC5]/10 bg-[#1f1710]/40 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
      <h1 className="text-2xl font-semibold text-[#FBDFC5]">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-[#FBDFC5]/50">
        Join to book unique stays or list your own.
      </p>

      {state?.success ? (
        <p className="mt-6 rounded-xl bg-[#CA6200]/15 px-4 py-3 text-sm text-[#FBDFC5]">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          </div>

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
              htmlFor="phone"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+20 100 000 0000"
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Gender{" "}
              <span className="normal-case text-[#FBDFC5]/30">(optional)</span>
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue=""
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none"
            >
              <option value="" className="bg-[#17110C]">
                Prefer not to say
              </option>
              <option value="Male" className="bg-[#17110C]">
                Male
              </option>
              <option value="Female" className="bg-[#17110C]">
                Female
              </option>
            </select>
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-red-400">{state.error}</p>
          )}

          <SubmitButton pendingText="Creating account...">Sign up</SubmitButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[#FBDFC5]/50">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#CA6200]">
          Log in
        </Link>
      </p>
    </div>
  );
}
