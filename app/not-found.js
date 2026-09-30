import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#17110C] px-6 text-center">
      <SadDuck />

      <div>
        <h1 className="text-3xl font-semibold text-[#FBDFC5] md:text-4xl">
          Well, this is awkward.
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[#FBDFC5]/60">
          The page you're looking for wandered off somewhere — even our duck
          couldn't find it.
        </p>
      </div>

      <Link
        href="/"
        className="rounded-full bg-[#CA6200] px-6 py-3 text-sm font-bold text-[#FBDFC5] transition-opacity hover:opacity-90"
      >
        Take me home
      </Link>
    </main>
  );
}

function SadDuck() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Puddle */}
      <ellipse
        cx="110"
        cy="190"
        rx="70"
        ry="10"
        fill="#FBDFC5"
        opacity="0.08"
      />

      {/* Body */}
      <ellipse cx="108" cy="140" rx="55" ry="42" fill="#FBDFC5" />

      {/* Wing (drooping) */}
      <path
        d="M78 130 C 60 140, 55 165, 70 175 C 85 170, 92 150, 88 132 Z"
        fill="#F0CFAD"
      />

      {/* Head */}
      <circle cx="140" cy="92" r="34" fill="#FBDFC5" />

      {/* Beak */}
      <path
        d="M168 96 C 182 98, 182 108, 168 110 C 162 108, 160 100, 168 96 Z"
        fill="#CA6200"
      />

      {/* Sad eyebrow */}
      <path
        d="M130 78 Q 138 72, 146 78"
        stroke="#17110C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sad eye (downturned) */}
      <path
        d="M132 90 Q 138 96, 144 90"
        stroke="#17110C"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tear drop */}
      <path
        d="M150 100 C 150 106, 145 110, 145 114 C 145 118, 148 120, 150 120 C 152 120, 155 118, 155 114 C 155 110, 150 106, 150 100 Z"
        fill="#7EC8E3"
        opacity="0.85"
      />

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
