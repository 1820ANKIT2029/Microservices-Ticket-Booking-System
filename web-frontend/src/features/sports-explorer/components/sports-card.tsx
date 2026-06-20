import type { SportsMatch, Team } from "@/features/sports-explorer/types";
import Image from "next/image";
import Link from "next/link";

interface SportsCardProps {
  match: SportsMatch;
}

function TeamLogo({ team }: { team: Team }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-surface rounded-full p-2 mb-2 shadow-inner flex items-center justify-center relative">
        <Image
          src={team.logoUrl}
          alt={team.logoAlt}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>
      <span className="text-label-md font-semibold">{team.name}</span>
    </div>
  );
}

export function SportsCard({ match }: SportsCardProps) {
  const isLive = match.status === "live";

  return (
    <article
      className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm hover:shadow-xl transition-all"
      id={`match-${match.id}`}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center mb-8">
        {isLive ? (
          <span className="bg-error/10 text-error text-label-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"
              aria-hidden="true"
            />
            LIVE NOW
          </span>
        ) : (
          <span className="bg-primary/10 text-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase">
            {match.time}
          </span>
        )}
        <span className="text-on-surface-variant text-label-md font-semibold">
          {match.league}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-around mb-8">
        <TeamLogo team={match.homeTeam} />
        <div className="text-center">
          {isLive && match.score ? (
            <>
              <span className="text-headline-md font-black text-on-surface-variant">
                {match.score}
              </span>
              <p className="text-label-sm text-on-surface-variant mt-1">
                72&apos;
              </p>
            </>
          ) : (
            <span className="text-headline-sm font-bold text-on-surface-variant">
              VS
            </span>
          )}
        </div>
        <TeamLogo team={match.awayTeam} />
      </div>

      {/* Venue */}
      {match.venue && (
        <p className="text-center text-on-surface-variant text-label-md font-semibold mb-4">
          {match.venue}
        </p>
      )}

      {/* CTA */}
      {isLive ? (
        <Link
          href={`/events/${match.id}`}
          className="w-full bg-primary-container text-on-primary py-3 rounded-xl text-label-md font-semibold hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all h-auto block text-center"
        >
          Buy Tickets
        </Link>
      ) : (
        <Link
          href={`/events/${match.id}`}
          className="w-full border border-primary text-primary py-3 rounded-xl text-label-md font-semibold hover:bg-primary-container hover:text-on-primary hover:border-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all h-auto block text-center"
        >
          Get Passes
        </Link>
      )}
    </article>
  );
}
