"use client";

import { Tag, Info, CameraOff, Clock, FileText, Share2, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import type { OfferCoupon, GuidelineItem } from "../types/event-detail";

interface OffersGuidelinesProps {
  offers: OfferCoupon[];
  guidelines: GuidelineItem[];
}

function GuidelineIcon({ name, className }: { name: string; className?: string }) {
  const iconProps = { className: className || "size-5 text-on-surface-variant shrink-0" };
  switch (name) {
    case "Info":
      return <Info {...iconProps} />;
    case "CameraOff":
      return <CameraOff {...iconProps} />;
    case "Clock":
      return <Clock {...iconProps} />;
    case "FileText":
      return <FileText {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
}

export function OffersGuidelines({ offers, guidelines }: OffersGuidelinesProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <aside className="space-y-6 text-left" aria-label="Event offers and guidelines">
      {/* Offers Card */}
      <div className="bg-surface-container-high rounded-xl p-6 border border-primary/10 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="text-primary size-5 fill-primary/10" aria-hidden="true" />
          <h3 className="text-headline-sm font-bold text-on-surface">Best Offers</h3>
        </div>

        <div className="space-y-3">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="p-4 bg-background rounded-lg border border-outline-variant border-dashed flex flex-col gap-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  {offer.code}
                </span>
                <span className="text-primary font-black text-label-md">{offer.discountText}</span>
              </div>
              <p className="text-label-sm text-on-surface-variant font-medium">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant shadow-sm">
        <h3 className="text-headline-sm font-bold text-on-surface mb-4">Guidelines</h3>
        <ul className="space-y-4" role="list">
          {guidelines.map((item, index) => (
            <li key={index} className="flex gap-3 items-start" role="listitem">
              <GuidelineIcon name={item.iconName} className="size-5 text-on-surface-variant shrink-0 mt-0.5" />
              <span className="text-label-md text-on-surface-variant font-medium leading-relaxed">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Share Section */}
      <div className="flex justify-center gap-6 py-2 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: document.title,
                url: window.location.href,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          className="flex flex-col items-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
        >
          <div className="p-3 bg-surface-container rounded-full group-hover:bg-primary-container group-hover:text-on-primary transition-all shadow-sm">
            <Share2 className="size-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-label-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Share</span>
        </button>

        <button
          type="button"
          onClick={() => setIsFavorited(!isFavorited)}
          className="flex flex-col items-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
          aria-label={isFavorited ? "Remove from watchlist" : "Add to watchlist"}
        >
          <div className={cn(
            "p-3 rounded-full transition-all shadow-sm",
            isFavorited 
              ? "bg-error text-on-error" 
              : "bg-surface-container group-hover:bg-primary-container group-hover:text-on-primary"
          )}>
            <Heart className={cn(
              "size-5 group-hover:scale-110 transition-transform",
              isFavorited && "fill-current"
            )} />
          </div>
          <span className="text-label-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Watchlist</span>
        </button>
      </div>
    </aside>
  );
}
