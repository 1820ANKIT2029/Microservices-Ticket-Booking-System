import { CONCERTS } from "@/shared/constants/landing-data";
import { ConcertCard } from "./concert-card";
import { SectionHeader } from "@/shared/components/section-header";

export function ConcertsSection() {
  const featured = CONCERTS.find((c) => c.variant === "featured");
  const compact = CONCERTS.filter((c) => c.variant === "compact");

  return (
    <section
      className="py-20 px-4 md:px-16 max-w-[1280px] mx-auto"
      aria-label="Concerts and Music Festivals"
      id="concerts"
    >
      <SectionHeader title="Concerts &amp; Music Festivals" className="mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        {featured && <ConcertCard concert={featured} />}
        <div className="md:col-span-5 grid grid-rows-2 gap-6">
          {compact.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      </div>
    </section>
  );
}
