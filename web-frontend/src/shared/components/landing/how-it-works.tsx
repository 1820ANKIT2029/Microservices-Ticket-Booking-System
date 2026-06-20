import { Compass, Ticket, PartyPopper } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/shared/constants/landing-data";
import { SectionHeader } from "@/shared/components/section-header";
import type { ReactNode } from "react";

const ICON_MAP: Record<string, ReactNode> = {
  Compass: <Compass className="size-10" aria-hidden="true" />,
  Ticket: <Ticket className="size-10" aria-hidden="true" />,
  PartyPopper: <PartyPopper className="size-10" aria-hidden="true" />,
};

export function HowItWorks() {
  return (
    <section
      className="py-20 bg-surface-container"
      aria-label="How it works"
      id="how-it-works"
    >
      <div className="px-4 md:px-16 max-w-[1280px] mx-auto">
        <SectionHeader
          title="Experience Simplicity"
          subtitle="Get your tickets in three effortless steps"
          align="center"
          className="mb-16"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <article
              key={step.title}
              className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/10 text-center flex flex-col items-center"
            >
              <div
                className={`w-20 h-20 rounded-3xl ${step.bgClass} flex items-center justify-center ${step.iconColorClass} mb-8`}
              >
                {ICON_MAP[step.icon]}
              </div>
              <h3 className="text-headline-sm font-semibold mb-4">
                {step.title}
              </h3>
              <p className="text-on-surface-variant text-body-md">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
