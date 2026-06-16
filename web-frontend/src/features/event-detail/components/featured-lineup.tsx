import Image from "next/image";
import type { CastMember } from "../types/event";

interface FeaturedLineupProps {
  lineup: CastMember[];
}

export function FeaturedLineup({ lineup }: FeaturedLineupProps) {
  return (
    <section aria-labelledby="lineup-title">
      <h2 id="lineup-title" className="text-headline-md font-bold mb-6 border-l-4 border-primary pl-3">
        Featured Lineup / Cast
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {lineup.map((member, index) => (
          <div key={index} className="group text-left" role="listitem">
            <div className="aspect-square rounded-xl overflow-hidden mb-3 border border-outline-variant group-hover:border-primary transition-colors relative">
              <Image
                src={member.imageUrl}
                alt={member.imageAlt}
                fill
                sizes="(max-width: 768px) 50vw, 250px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="font-bold text-on-surface text-label-md">{member.name}</p>
            <p className="text-label-sm text-on-surface-variant font-medium mt-0.5">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
