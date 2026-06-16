import { CheckCircle } from "lucide-react";

const BENEFITS = [
  "Zero Convenience Fees on all bookings",
  "48-Hour Early Access to mega-concerts",
  "Exclusive VIP Lounge access at select venues",
];

export function PremierClub() {
  return (
    <section
      className="py-20 px-4 md:px-16 max-w-[1280px] mx-auto"
      aria-label="Premier Club"
      id="premier-club"
    >
      <div className="relative rounded-[3rem] bg-primary text-on-primary overflow-hidden">
        {/* Decorative radial gradient */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>

        <div className="px-6 md:px-20 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left content */}
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-headline-md md:text-display-lg font-bold mb-6 leading-tight">
              Elevate Your Access with{" "}
              <span className="text-secondary-fixed">Premier Club</span>
            </h2>
            <ul className="space-y-4 mb-10 text-body-lg font-medium">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle
                    className="size-6 text-secondary-fixed shrink-0"
                    aria-hidden="true"
                  />
                  {benefit}
                </li>
              ))}
            </ul>
            <button
              className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 rounded-2xl text-label-md font-bold text-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 transition-all shadow-xl"
              type="button"
            >
              Join Premier Club Now
            </button>
          </div>

          {/* Membership card preview with responsive sizing limit */}
          <div
            className="w-full max-w-[400px] aspect-square glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-on-surface !border-none"
            aria-label="Membership card preview"
          >
            <div className="mb-6 relative">
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-on-primary text-4xl font-black">
                EP
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-lg text-sm font-black shadow-lg">
                GOLD
              </div>
            </div>
            <p className="text-center text-headline-sm font-semibold mb-2">
              Alex Johnson
            </p>
            <p className="text-on-surface-variant mb-6">Member since 2022</p>
            <div
              className="w-full h-2 bg-surface rounded-full mb-2"
              role="progressbar"
              aria-valuenow={75}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reward progress"
            >
              <div className="w-3/4 h-full bg-primary rounded-full" />
            </div>
            <p className="text-label-sm text-on-surface-variant">
              750 Points to next reward
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
