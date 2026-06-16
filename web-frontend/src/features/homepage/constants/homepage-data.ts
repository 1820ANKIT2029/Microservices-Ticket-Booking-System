import type { Movie, SportsMatch, Concert, Step } from "@/features/events/types";

export const FEATURED_MOVIES: Movie[] = [
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    genre: "Sci-Fi / Action",
    duration: "2h 15m",
    imageUrl: "https://placehold.co/400x600/5400c3/ffffff/png?text=Neon+Horizon",
    imageAlt: "Futuristic sci-fi movie poster with neon-lit cybernetic city",
    gradient: "from-indigo-900 via-purple-800 to-violet-600",
    badge: "PREMIUM",
  },
  {
    id: "summer-whispers",
    title: "Summer Whispers",
    genre: "Drama / Romance",
    duration: "1h 48m",
    imageUrl: "https://placehold.co/400x600/ffb599/370e00/png?text=Summer+Whispers",
    imageAlt: "Romantic drama set in a colorful European street during summer",
    gradient: "from-rose-300 via-pink-400 to-purple-400",
  },
  {
    id: "midnight-protocol",
    title: "Midnight Protocol",
    genre: "Thriller / Mystery",
    duration: "2h 05m",
    imageUrl: "https://placehold.co/400x600/1d1a25/ffffff/png?text=Midnight+Protocol",
    imageAlt: "Dark rain-slicked city alley with neon signs",
    gradient: "from-slate-900 via-purple-900 to-fuchsia-800",
  },
  {
    id: "cloud-kingdom",
    title: "Cloud Kingdom",
    genre: "Animation / Family",
    duration: "1h 35m",
    imageUrl: "https://placehold.co/400x600/dadff3/5d6273/png?text=Cloud+Kingdom",
    imageAlt: "Whimsical animated fantasy world of clouds and floating islands",
    gradient: "from-sky-300 via-blue-300 to-violet-300",
  },
];

export const SPORTS_MATCHES: SportsMatch[] = [
  {
    id: "ucl-match",
    league: "UEFA Champions League",
    status: "live",
    homeTeam: {
      name: "LDN Red",
      initials: "LR",
      logoUrl: "https://placehold.co/80x80/ba1a1a/ffffff/png?text=LR",
      gradient: "from-red-500 to-red-700",
      logoAlt: "London Red football club crest",
    },
    awayTeam: {
      name: "MNC Blue",
      initials: "MB",
      logoUrl: "https://placehold.co/80x80/005b9f/ffffff/png?text=MB",
      gradient: "from-sky-400 to-blue-700",
      logoAlt: "Manchester Blue football club logo",
    },
    score: "2 - 1",
  },
  {
    id: "t20-match",
    league: "T20 International",
    status: "upcoming",
    time: "Today, 19:30",
    venue: "Wankhede Stadium, Mumbai",
    homeTeam: {
      name: "Kings XI",
      initials: "KX",
      logoUrl: "https://placehold.co/80x80/007f5f/ffffff/png?text=KX",
      gradient: "from-emerald-500 to-emerald-700",
      logoAlt: "Kings XI cricket team badge with lion motif",
    },
    awayTeam: {
      name: "Riptide",
      initials: "RT",
      logoUrl: "https://placehold.co/80x80/ff5c00/ffffff/png?text=RT",
      gradient: "from-orange-400 to-orange-700",
      logoAlt: "Riptide cricket franchise logo",
    },
  },
  {
    id: "laliga-match",
    league: "La Liga",
    status: "upcoming",
    time: "Tomorrow, 21:00",
    venue: "Santiago Bernabéu",
    homeTeam: {
      name: "Madrid FC",
      initials: "MF",
      logoUrl: "https://placehold.co/80x80/ffcc00/1d1a25/png?text=MF",
      gradient: "from-amber-300 to-red-600",
      logoAlt: "Madrid FC classic football club logo",
    },
    awayTeam: {
      name: "Barca City",
      initials: "BC",
      logoUrl: "https://placehold.co/80x80/002244/ffffff/png?text=BC",
      gradient: "from-blue-600 to-red-500",
      logoAlt: "Barca City minimalist football badge",
    },
  },
];

export const CONCERTS: Concert[] = [
  {
    id: "aurora-borealis",
    title: "Aurora Borealis: Live 2024",
    subtitle: "WORLD TOUR",
    description:
      "Experience the global sensation in a 360-degree immersive stage setup. One night only in the city center arena.",
    imageUrl: "https://placehold.co/1200x800/5400c3/ffffff/png?text=Aurora+Borealis+Live+2024",
    imageAlt:
      "Massive music festival stage with intense laser shows and purple lighting",
    gradient: "from-purple-900 via-violet-700 to-indigo-500",
    variant: "featured",
  },
  {
    id: "jazz-nights",
    title: "Jazz Nights: Summer Session",
    subtitle: "Aug 15-20 • The Blue Note",
    imageUrl: "https://placehold.co/600x400/7b2900/ffffff/png?text=Jazz+Nights",
    imageAlt: "Jazz musician playing saxophone in a dimly lit high-end club",
    gradient: "from-amber-700 via-orange-800 to-yellow-900",
    variant: "compact",
  },
  {
    id: "indie-folk",
    title: "Indie Folk Festival",
    subtitle: "Sept 05 • Riverside Park",
    imageUrl: "https://placehold.co/600x400/a23900/ffffff/png?text=Indie+Folk+Festival",
    imageAlt: "Indie band performance on an outdoor stage at sunset",
    gradient: "from-amber-500 via-orange-400 to-purple-500",
    variant: "compact",
  },
];

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    icon: "Compass",
    title: "1. Discover",
    description:
      "Browse through thousands of events tailored to your interests using our AI-driven discovery engine.",
    bgClass: "bg-[#5400c3]/10",
    iconColorClass: "text-[#5400c3]",
  },
  {
    icon: "Ticket",
    title: "2. Book",
    description:
      "Select your preferred seats with our interactive 3D map and checkout securely in seconds.",
    bgClass: "bg-[#dadff3]",
    iconColorClass: "text-[#5d6273]",
  },
  {
    icon: "PartyPopper",
    title: "3. Enjoy",
    description:
      "Scan your digital pass at the venue and immerse yourself in the experience. No printing needed.",
    bgClass: "bg-[#ffdbce]",
    iconColorClass: "text-[#370e00]",
  },
];

export const COMPANY_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Press Room", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact Support", href: "#" },
] as const;

export const LEGAL_LINKS = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cookie Policy", href: "#" },
] as const;
