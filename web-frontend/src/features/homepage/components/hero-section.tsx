import { Film, Calendar, Search } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[600px] h-[calc(100vh-5rem)] max-h-[870px] flex flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background placehold.co Image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="https://placehold.co/1920x1080/1d1a25/ffffff/png?text=EventPass+Live+Experiences"
          alt="EventPass Hero Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-16 max-w-[1280px] mx-auto w-full text-center md:text-left">
        <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface mb-6 max-w-2xl leading-tight">
          Your Gateway to{" "}
          <span className="text-primary">Live Experiences</span>
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto md:mx-0">
          Discover, book, and experience the best movies, sports, and live
          concerts in your city with one seamless platform.
        </p>

        {/* Glass-morphic search bar with focus-within highlighting */}
        <div className="max-w-3xl glass-card rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl mx-auto md:mx-0 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-outline-variant/30">
            <Film
              className="size-5 text-primary shrink-0"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Movies, Events, or Venues"
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md placeholder:text-on-surface-variant/60"
              aria-label="Search for movies, events, or venues"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <Calendar
              className="size-5 text-primary shrink-0"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Pick a date"
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md placeholder:text-on-surface-variant/60"
              aria-label="Pick a date"
            />
          </div>
          <button
            className="bg-primary text-on-primary px-10 py-4 rounded-xl text-label-md font-semibold hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all flex items-center justify-center gap-2"
            type="button"
          >
            <Search className="size-5" aria-hidden="true" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
