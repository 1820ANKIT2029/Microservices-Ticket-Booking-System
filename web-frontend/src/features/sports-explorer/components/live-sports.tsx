import { SPORTS_MATCHES } from "@/shared/constants/landing-data";
import { SportsCard } from "./sports-card";
import { SectionHeader } from "@/shared/components/section-header";

export function LiveSports() {
  return (
    <section
      className="bg-surface-container-low py-20"
      aria-label="Live Sports"
      id="live-sports"
    >
      <div className="px-4 md:px-16 max-w-[1280px] mx-auto">
        <SectionHeader
          title="Live Sports Pulse"
          subtitle="Catch the thrill of the game live"
          className="mb-10"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPORTS_MATCHES.map((match) => (
            <SportsCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
