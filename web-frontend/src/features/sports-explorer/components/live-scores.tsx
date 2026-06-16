import { LIVE_SCORES } from "../constants/sports-data";

export function LiveScores() {
  return (
    <section className="mb-8" aria-labelledby="live-scores-title">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-3 w-3 relative" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
        </span>
        <h2 id="live-scores-title" className="text-headline-sm font-bold text-on-background">
          Live Scores
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LIVE_SCORES.map((score) => (
          <div
            key={score.id}
            className="bg-card border border-outline-variant p-6 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            role="region"
            aria-label={`Live score for ${score.matchName}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-label-sm font-bold text-on-surface-variant">
                {score.matchName}
              </span>
              <span className="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {score.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-label-md font-semibold text-on-surface">{score.team1}</span>
                <span className="font-bold text-on-surface">{score.team1Score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-label-md font-semibold text-on-surface">{score.team2}</span>
                <span className="font-bold text-on-surface">{score.team2Score}</span>
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant mt-3 border-t border-outline-variant/30 pt-2 italic">
              {score.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
