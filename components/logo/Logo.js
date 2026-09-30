import Link from "next/link";

const SIZES = {
  nav: {
    icon: 40,
    wordmark: "text-lg",
    tagline: "hidden", // tagline doesn't fit in a navbar
    gap: "gap-2.5",
  },
  sm: {
    icon: 48,
    wordmark: "text-xl",
    tagline: "hidden",
    gap: "gap-3",
  },
  default: {
    icon: 72,
    wordmark: "text-3xl",
    tagline: "block",
    gap: "gap-4",
  },
  hero: {
    icon: 96,
    wordmark: "text-4xl",
    tagline: "block",
    gap: "gap-5",
  },
  footer: {
    icon: 44,
    wordmark: "text-xl",
    tagline: "block",
    gap: "gap-2.5",
  },
};

export default function Logo({
  size = "default",
  showTagline = true,
  href = "/",
}) {
  const config = SIZES[size] ?? SIZES.default;

  return (
    <Link href={href} className={`flex items-center ${config.gap} shrink-0`}>
      <svg
        width={config.icon}
        height={config.icon}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r="48" fill="#CA6200" />
        <path
          d="M50 22 L82 58 L74 58 L74 78 L26 78 L26 58 L18 58 Z"
          fill="#FBDFC5"
        />
        <rect x="43" y="62" width="14" height="16" rx="3" fill="#CA6200" />
        <circle cx="66" cy="36" r="5" fill="#FBDFC5" />
      </svg>

      <div className="flex flex-col leading-none">
        <span
          className={`font-semibold tracking-tight text-[#FBDFC5] ${config.wordmark}`}
        >
          Atfdal<span className="text-[#CA6200]"> 3andi</span>
        </span>
        {showTagline && (
          <span
            className={`${config.tagline} mt-1 text-[10px] font-medium tracking-[2.5px] lowercase text-[#CA6200]/85`}
          >
            stays worth wandering to
          </span>
        )}
      </div>
    </Link>
  );
}
