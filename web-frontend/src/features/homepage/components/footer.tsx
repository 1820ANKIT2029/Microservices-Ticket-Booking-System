import Link from "next/link";
import { Globe, Share2, PlayCircle, /* Smartphone, AppWindow */ } from "lucide-react";
// import { COMPANY_LINKS, LEGAL_LINKS } from "@/features/homepage/constants/homepage-data";

const SOCIAL_ICONS = [
  { icon: Globe, label: "Website" },
  { icon: Share2, label: "Share" },
  { icon: PlayCircle, label: "YouTube" },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="flex flex-col items-center justify-center text-center w-full px-4 md:px-16 py-12 max-w-[1280px] mx-auto gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center max-w-md">
          <Link
            href="/"
            className="text-headline-md font-black text-primary mb-4 block hover:opacity-90 transition-opacity"
          >
            EventPass
          </Link>
          <p className="text-on-surface-variant text-body-md mb-6 leading-relaxed">
            Redefining how you experience live entertainment. Trusted by
            millions for secure and effortless booking.
          </p>
          <div className="flex gap-4 justify-center" role="list" aria-label="Social links">
            {SOCIAL_ICONS.map(({ icon: Icon, label }) => (
              <Link
                key={label}
                href="#"
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300"
                aria-label={label}
                role="listitem"
              >
                <Icon className="size-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        {/* Link groups (disabled for simple footer) */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 flex-1">
          <div className="space-y-4">
            <h4 className="text-label-md font-semibold text-on-surface uppercase tracking-widest mb-6">
              Company
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Company links">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-on-surface-variant text-body-md hover:text-secondary hover:underline decoration-secondary-container transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-label-md font-semibold text-on-surface uppercase tracking-widest mb-6">
              Legal
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Legal links">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-on-surface-variant text-body-md hover:text-secondary hover:underline decoration-secondary-container transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-label-md font-semibold text-on-surface uppercase tracking-widest mb-6">
              Mobile App
            </h4>
            <p className="text-on-surface-variant text-sm mb-4">
              Book on the go with our award-winning mobile app.
            </p>
            <button
              className="bg-on-surface text-surface px-6 py-3 rounded-xl flex items-center gap-3 w-full hover:opacity-90 transition-all"
              type="button"
            >
              <Smartphone className="size-5 shrink-0" aria-hidden="true" />
              <span className="text-left">
                <span className="block text-[10px] leading-none opacity-70">
                  GET IT ON
                </span>
                <span className="block font-bold">Google Play</span>
              </span>
            </button>
            <button
              className="bg-on-surface text-surface px-6 py-3 rounded-xl flex items-center gap-3 w-full hover:opacity-90 transition-all"
              type="button"
            >
              <AppWindow className="size-5 shrink-0" aria-hidden="true" />
              <span className="text-left">
                <span className="block text-[10px] leading-none opacity-70">
                  Download on
                </span>
                <span className="block font-bold">App Store</span>
              </span>
            </button>
          </div>
        </div> */}
      </div>

      {/* Copyright */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 border-t border-outline-variant/10 text-center">
        <p className="text-on-surface-variant text-body-md opacity-80">
          © 2024 EventPass. All rights reserved. Electric Pulse: Daybreak
          Edition UI.
        </p>
      </div>
    </footer>
  );
}
