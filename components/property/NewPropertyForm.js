"use client";

import { useActionState, useState } from "react";
import { useFormState } from "react-dom";
import { createPropertyAction } from "@/lib/actions/property";
import SubmitButton from "@/components/auth/Submitbutton";
import LocationPicker from "./LocationPicker";


const initialState = { error: [] , values: {} };

const CATEGORY_OPTIONS = ["Farm", "Camping", "Mountain", "Cabin"];

const AMENITY_OPTIONS = [
  "Wood-burning fireplace",
  "Lake access",
  "Free parking",
  "Full kitchen",
  "Hiking trails nearby",
  "Fire pit",
  "Wifi",
  "Pet friendly",
  "Hot tub",
  "Air conditioning",
];

export default function NewPropertyForm({user}){


    const [state, formAction] = useActionState(
      createPropertyAction,
      initialState,
    );
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

    async function handlePhotosChange(e) {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const previews = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setPhotoPreviews(previews);
      setUploadError(null);

    }

    const formKey = JSON.stringify(state);
    return (
      <form
        action={formAction}
        className="mt-8 flex flex-col gap-8"
        key={formKey}
      >
        {/* Basics */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#FBDFC5]">Basics</h2>

          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={state?.values?.title ?? ""}
              placeholder="Emerald Lake Cabin"
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={state?.values?.description ?? ""}
              placeholder="Describe the place, the setting, and what makes it unique..."
              className="w-full resize-none rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={state?.values?.category ?? ""}
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none"
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <LocationPicker />
        </section>

        {/* Capacity & pricing */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#FBDFC5]">
            Capacity & pricing
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { id: "guests", label: "Guests" },
              { id: "bedrooms", label: "Bedrooms" },
              { id: "beds", label: "Beds" },
              { id: "baths", label: "Baths" },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type="number"
                  min={0}
                  required
                  defaultValue={state?.values?.[field.id] ?? 1}
                  className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none"
                />
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor="pricePerNight"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            >
              Price per night (USD)
            </label>
            <input
              id="pricePerNight"
              name="pricePerNight"
              type="number"
              min={0}
              required
              placeholder="120"
              defaultValue={state?.values?.price_per_night ?? ""}
              className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30 sm:max-w-xs"
            />
          </div>
        </section>

        {/* Amenities */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#FBDFC5]">Amenities</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AMENITY_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#17110C] px-3 py-2.5 text-sm text-[#FBDFC5]/80 has-[:checked]:text-[#FBDFC5] has-[:checked]:ring-1 has-[:checked]:ring-[#CA6200]"
              >
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  className="accent-[#CA6200]"
                  defaultChecked={
                    state?.values?.amenities?.includes(amenity) ?? false
                  }
                />
                {amenity}
              </label>
            ))}
          </div>
        </section>

        {/* Photos */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#FBDFC5]">Photos</h2>

          <label
            htmlFor="photos"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#FBDFC5]/20 bg-[#17110C] px-6 py-10 text-center transition-colors hover:border-[#CA6200]"
          >
            <span className="text-sm font-semibold text-[#FBDFC5]">
              {isUploading ? "Uploading..." : "Click to upload photos"}
            </span>
            <span className="text-xs text-[#FBDFC5]/40">
              PNG or JPG, multiple files supported
            </span>
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              name="photos"
              onChange={handlePhotosChange}
              className="hidden"
            />
          </label>

          {uploadError && (
            <p className="text-sm font-medium text-red-400">{uploadError}</p>
          )}

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photoPreviews.map((photo) => (
                <div
                  key={photo.url}
                  className="aspect-square overflow-hidden rounded-xl bg-[#17110C]"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
        </section>

        {state?.error && state.error.length > 0 && (
          <ul className="flex flex-col gap-1">
            {state.error.map((msg, i) => (
              <li key={i} className="text-sm font-medium text-red-400">
                {msg}
              </li>
            ))}
          </ul>
        )}
        <SubmitButton pendingText="Publishing listing...">
          List my property
        </SubmitButton>
      </form>
    );
}