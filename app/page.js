import heroIMG from '@/assets/hero.webp';
import Image from 'next/image';
export default function HomePage() {
  return (
    <main>
      <section className="hero flex items-end px-5 pb-10 pt-32 lg:px-8 lg:pb-16">
        <Image
          className="hero-image"
          src={heroIMG}
          alt="Forest retreat surrounded by tall evergreen trees"
        />

        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow reveal mb-4 text-[#CA6200]">STAY THE STORY</p>

            <h1 className="display reveal text-5xl font-semibold leading-[.99] tracking-tight text-[#FBDFC5] sm:text-6xl lg:text-7xl">
              Your next stay isn't just a place. It's an adventure.
            </h1>

            <p className="reveal-2 mt-6 max-w-xl text-lg leading-relaxed text-[#FBDFC5]/70">
              Discover extraordinary places, unforgettable experiences, and
              stays worth the journey.
            </p>
          </div>

          <form className="search-shell reveal-3 mt-9 grid max-w-5xl rounded-4xl p-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <div className="input-wrap px-4 py-3">
              <label
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3A2A1D]/70"
                htmlFor="where"
              >
                Where?
              </label>

              <input
                id="where"
                className="w-full bg-transparent text-sm font-semibold text-[#3A2A1D] outline-none placeholder:text-[#3A2A1D]/50"
                type="text"
                placeholder="Anywhere"
              />
            </div>

            <div className="input-wrap px-4 py-3">
              <label
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3A2A1D]/70"
                htmlFor="dates"
              >
                Dates
              </label>

              <input
                id="dates"
                className="w-full bg-transparent text-sm font-semibold text-[#3A2A1D] outline-none placeholder:text-[#3A2A1D]/50"
                type="text"
                placeholder="Add dates"
              />
            </div>

            <div className="input-wrap px-4 py-3">
              <label
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3A2A1D]/70"
                htmlFor="guests"
              >
                Guests
              </label>

              <input
                id="guests"
                className="w-full bg-transparent text-sm font-semibold text-[#3A2A1D] outline-none placeholder:text-[#3A2A1D]/50"
                type="text"
                placeholder="Add guests"
              />
            </div>

            <button
              className="round-btn m-1 flex items-center justify-center gap-2 rounded-3xl bg-[#CA6200] px-5 py-4 text-sm font-bold text-[#ffe7d0]"
              type="submit"
            >
              Explore
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              className="round-btn inline-flex items-center gap-2 rounded-full bg-[#CA6200] px-5 py-3 text-sm font-bold text-[#ffe7d0]"
              type="button"
            >
              Explore Adventures
            </button>

            <button
              className="round-btn rounded-full border border-[#FBDFC5]/60 px-5 py-3 text-sm font-bold text-[#FBDFC5]"
              type="button"
            >
              Become a Host
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
