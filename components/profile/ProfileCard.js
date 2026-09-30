"use client";

import { useState, useActionState, useEffect } from "react";
import Avatar from "./Avatar";
import { updateProfileAction } from "@/lib/actions/profile";

const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"];

function formatJoinedDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const initialState = { error: null, success: false };

export default function ProfileCard({ profile, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(profile);


  const [state, formAction, isPending] = useActionState(async (prevState) => {
    const result = await updateProfileAction(formValues);
    if (result?.error) return { error: result.error, success: false };
    return { error: null, success: true };
  }, initialState);

  // Close edit mode once a save succeeds
  useEffect(() => {
    if (state.success) setIsEditing(false);
  }, [state.success]);

  function handleChange(field, value) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setFormValues(profile);
    setIsEditing(false);
  }

  return (
    <div className="rounded-[1.75rem] border border-[#FBDFC5]/10 bg-[#1f1710]/60 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
      {isOwner && (
        <div className="mb-6 flex justify-end">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-full border border-[#FBDFC5]/20 px-4 py-2 text-xs font-semibold text-[#FBDFC5]/70 transition-colors hover:border-[#FBDFC5]/40 hover:text-[#FBDFC5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={isPending}
                className="rounded-full bg-[#CA6200] px-4 py-2 text-xs font-bold text-[#FBDFC5] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-[#FBDFC5]/20 px-4 py-2 text-xs font-semibold text-[#FBDFC5]/70 transition-colors hover:border-[#CA6200] hover:text-[#CA6200]"
            >
              Edit profile
            </button>
          )}
        </div>
      )}

      <form
        id="profile-form"
        action={formAction}
        className="flex flex-col items-center gap-6 text-center"
      >
        <Avatar url={profile.avatar_url} name={profile.full_name} size={112} />

        <div className="flex flex-col items-center gap-1.5">
          {isEditing ? (
            <input
              type="text"
              value={formValues.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Your name"
              className="rounded-xl bg-[#17110C] px-4 py-2 text-center text-lg font-semibold text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-[#FBDFC5] md:text-3xl">
              {profile.full_name}
            </h1>
          )}
          <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#CA6200]">
            Joined {formatJoinedDate(profile.created_at)}
          </span>
        </div>

        <div className="grid w-full gap-4 text-left sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/40">
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formValues.phone ?? ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
              />
            ) : (
              <p className="text-sm text-[#FBDFC5]/80">
                {profile.phone || "Not set"}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/40">
              Gender
            </label>
            {isEditing ? (
              <select
                value={formValues.gender ?? ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none"
              >
                <option value="" disabled>
                  Select
                </option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-[#FBDFC5]/80">
                {profile.gender || "Not set"}
              </p>
            )}
          </div>
        </div>

        <div className="w-full text-left">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/40">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={formValues.bio ?? ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              placeholder="Tell people a bit about yourself..."
              className="w-full resize-none rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          ) : (
            <p className="text-sm leading-relaxed text-[#FBDFC5]/70">
              {profile.bio || "No bio yet."}
            </p>
          )}
        </div>

        {state.error && (
          <p className="text-sm font-medium text-red-400">{state.error}</p>
        )}
      </form>
    </div>
  );
}
