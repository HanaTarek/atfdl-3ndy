"use client";

export default function SearchProperty() {
  function handleSearchSubmit(e) {
    e.preventDefault();
    // TODO: wire up search logic
  }

  return (
    <>
      {/* Search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="mx-auto mt-10 grid max-w-4xl gap-2 rounded-[2rem] bg-[#1f1710] p-2 md:grid-cols-[1.2fr_1fr_1fr_auto]"
      >
        <div className="px-4 py-3">
          <label
            className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            htmlFor="where"
          >
            Where?
          </label>
          <input
            id="where"
            type="text"
            placeholder="Anywhere"
            className="w-full bg-transparent text-sm font-semibold text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/40"
          />
        </div>

        <div className="px-4 py-3">
          <label
            className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            htmlFor="dates"
          >
            Dates
          </label>
          <input
            id="dates"
            type="text"
            placeholder="Add dates"
            className="w-full bg-transparent text-sm font-semibold text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/40"
          />
        </div>

        <div className="px-4 py-3">
          <label
            className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
            htmlFor="guests"
          >
            Guests
          </label>
          <input
            id="guests"
            type="text"
            placeholder="Add guests"
            className="w-full bg-transparent text-sm font-semibold text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/40"
          />
        </div>

        <button
          onClick={handleSearchSubmit}
          type="submit"
          className="m-1 flex items-center justify-center rounded-2xl bg-[#CA6200] px-5 py-4 text-sm font-bold text-[#FBDFC5]"
        >
          Search
        </button>
      </form>
    </>
  );
}
