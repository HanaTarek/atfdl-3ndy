"use client";

export default function Error({ error, reset }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#17110C] px-6 text-center">
      <FrazzledDuck />

      <div>
        <h1 className="text-3xl font-semibold text-[#FBDFC5] md:text-4xl">
          The duck short-circuited.
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[#FBDFC5]/60">
          Something went wrong on our end. It's not you, it's us — well, it's
          the duck, technically.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-full bg-[#CA6200] px-6 py-3 text-sm font-bold text-[#FBDFC5] transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-[#FBDFC5]/30 px-6 py-3 text-sm font-bold text-[#FBDFC5] transition-colors hover:border-[#CA6200] hover:text-[#CA6200]"
        >
          Take me home
        </a>
      </div>
    </main>
  );
}

function FrazzledDuck() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sparks around head */}
      <g stroke="#CA6200" strokeWidth="2.5" strokeLinecap="round">
        <path d="M182 60 L192 52" />
        <path d="M186 72 L198 70" />
        <path d="M96 52 L88 44" />
        <path d="M92 66 L80 62" />
      </g>

      {/* Body */}
      <ellipse cx="108" cy="140" rx="55" ry="42" fill="#FBDFC5" />

      {/* Ruffled wing, sticking out */}
      <path
        d="M76 122 C 55 118, 45 138, 58 152 C 74 154, 90 142, 86 124 Z"
        fill="#F0CFAD"
      />

      {/* Head, slightly tilted */}
      <g transform="rotate(-8 140 92)">
        <circle cx="140" cy="92" r="34" fill="#FBDFC5" />

        {/* Beak, open */}
        <path
          d="M168 90 C 184 90, 184 100, 168 104 C 176 96, 176 96, 168 90 Z"
          fill="#CA6200"
        />
        <path
          d="M166 98 C 178 100, 178 106, 166 108 Z"
          fill="#17110C"
          opacity="0.5"
        />

        {/* Dizzy spiral eyes */}
        <g stroke="#17110C" strokeWidth="2" fill="none">
          <path d="M124 82 m-5 0 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0" />
          <path d="M126 82 l-2 -2 M126 82 l2 2" strokeWidth="1.5" />
          <path d="M148 78 m-5 0 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0" />
          <path d="M150 78 l-2 -2 M150 78 l2 2" strokeWidth="1.5" />
        </g>

        {/* Ruffled head feather */}
        <path
          d="M120 64 L114 50 M128 60 L126 46 M136 58 L138 44"
          stroke="#FBDFC5"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Feet */}
      <path
        d="M92 178 L88 190 M92 178 L96 190 M92 178 L92 192"
        stroke="#CA6200"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M124 180 L120 192 M124 180 L128 192 M124 180 L124 194"
        stroke="#CA6200"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
