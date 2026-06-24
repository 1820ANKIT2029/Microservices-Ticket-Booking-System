import Link from "next/link";
import { MapPin, Award } from "lucide-react";
import { LOCAL_MATCHES } from "../constants/sports-data";

export function MatchesNearYou() {
  return (
    <aside className="space-y-6" aria-label="Local events and promotions">
      {/* Local Matches Card */}
      <div className="bg-card rounded-xl border border-outline-variant p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-primary size-5" aria-hidden="true" />
          <h3 className="text-headline-sm font-bold text-on-surface">Matches Near You</h3>
        </div>

        <div className="space-y-3">
          {LOCAL_MATCHES.map((match) => (
            <Link
              key={match.id}
              href={`/events/detail?id=${match.id}`}
              className="block p-4 border border-outline-variant rounded-lg hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors text-left"
            >
              <h4 className="text-label-md font-bold text-on-surface">{match.title}</h4>
              <p className="text-[12px] text-on-surface-variant mt-1">
                {match.location} • {match.date}
              </p>
              <div className="mt-2 text-primary font-bold text-[12px]">{match.priceText}</div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="w-full mt-4 text-primary font-bold text-label-md py-2.5 border border-primary rounded-lg hover:bg-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
        >
          Discover More Local Sports
        </button>
      </div>

      {/* Season Pass Banner */}
      <div className="bg-primary-container text-on-primary-container p-6 rounded-xl relative overflow-hidden shadow-sm">
        <div className="relative z-10 text-left">
          <h3 className="text-headline-sm font-black text-on-primary-container mb-2">
            Sports Season Pass
          </h3>
          <p className="text-label-sm text-on-primary-container/90 mb-4 font-medium leading-relaxed">
            Get exclusive access to all major matches this season with 20% savings.
          </p>
          <button
            type="button"
            className="bg-background text-primary font-bold py-2.5 px-6 rounded-lg text-label-sm hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-md"
          >
            Join Pro
          </button>
        </div>
        <Award className="absolute -bottom-6 -right-6 size-36 text-on-primary-container/10 rotate-12 pointer-events-none" aria-hidden="true" />
      </div>
    </aside>
  );
}
