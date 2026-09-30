import Link from "next/link";
import Logo from "../logo/Logo";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { label: "Farms", href: "/explore?type=farm" },
      { label: "Camping", href: "/explore?type=camping" },
      { label: "Mountain stays", href: "/explore?type=mountain" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { label: "Become a host", href: "/host" },
      { label: "Host resources", href: "/host/resources" },
      { label: "Add a collaborator", href: "/host/collaborators" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#17110C] px-6 py-14 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Logo size="footer" />
            <p className="mt-4 text-sm leading-relaxed text-[#FBDFC5]/70">
              Extraordinary places to stay — farms, campsites, and mountain
              retreats you won&apos;t find anywhere else.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {FOOTER_LINKS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-sm font-semibold text-[#FBDFC5]">
                  {column.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#FBDFC5]/70 transition-colors hover:text-[#CA6200]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#FBDFC5]/10 pt-6 sm:flex-row">
          <p className="text-xs text-[#FBDFC5]/50">
            © {new Date().getFullYear()} Atfdal 3andi. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="https://instagram.com"
              className="text-xs text-[#FBDFC5]/50 transition-colors hover:text-[#CA6200]"
            >
              Instagram
            </Link>
            <Link
              href="https://facebook.com"
              className="text-xs text-[#FBDFC5]/50 transition-colors hover:text-[#CA6200]"
            >
              Facebook
            </Link>
            <Link
              href="https://tiktok.com"
              className="text-xs text-[#FBDFC5]/50 transition-colors hover:text-[#CA6200]"
            >
              TikTok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
