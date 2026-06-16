import type {
  HeroMovie,
  TrendingMovie,
  RecommendedMovie,
  GenreCard,
  ComingSoonMovie,
} from "../types/movies";

export const HERO_MOVIES: HeroMovie[] = [
  {
    id: "cyberfall-legacy",
    title: "Cyberfall: Legacy",
    badge: "NOW SHOWING",
    description:
      "In a world where memories are currency, one detective must find his own stolen past before the city consumes itself.",
    imageUrl: "https://placehold.co/1920x1080/1d1a25/ffffff/png?text=Cyberfall:+Legacy+Backdrop",
    imageAlt: "A cinematic wide shot of a futuristic neon-lit city under a perpetual twilight sky.",
  },
];

export const TRENDING_MOVIES: TrendingMovie[] = [
  {
    id: "the-last-horizon",
    title: "The Last Horizon",
    genre: "Sci-Fi",
    formatOrLanguage: "IMAX",
    imageUrl: "https://placehold.co/400x600/5400c3/ffffff/png?text=The+Last+Horizon",
    imageAlt: "Movie poster showing a silhouette of a lone protagonist against a massive red sun.",
    rating: "9.2/10",
  },
  {
    id: "forest-spirits",
    title: "Forest Spirits",
    genre: "Animation",
    formatOrLanguage: "English",
    imageUrl: "https://placehold.co/400x600/ffb599/370e00/png?text=Forest+Spirits",
    imageAlt: "Animated movie poster showing a group of woodland creatures gathered around a glowing flower.",
    rating: "8.8/10",
  },
  {
    id: "midnight-echoes",
    title: "Midnight Echoes",
    genre: "Thriller",
    formatOrLanguage: "Hindi",
    imageUrl: "https://placehold.co/400x600/1d1a25/ffffff/png?text=Midnight+Echoes",
    imageAlt: "Thriller movie poster featuring a rainy city street at night, reflected in a puddle.",
    rating: "9.5/10",
  },
  {
    id: "veloce-redline",
    title: "Veloce: Redline",
    genre: "Action",
    formatOrLanguage: "3D",
    imageUrl: "https://placehold.co/400x600/ba1a1a/ffffff/png?text=Veloce+Redline",
    imageAlt: "Action movie poster showing a high-speed motorcycle chase through a modern city.",
    rating: "8.4/10",
  },
  {
    id: "autumn-brew",
    title: "Autumn Brew",
    genre: "Comedy",
    formatOrLanguage: "English",
    imageUrl: "https://placehold.co/400x600/dadff3/5d6273/png?text=Autumn+Brew",
    imageAlt: "Comedy poster featuring two people laughing together over coffee in a sunlit boutique cafe.",
    rating: "8.1/10",
  },
];

export const RECOMMENDED_MOVIES: RecommendedMovie[] = [
  {
    id: "abyssal-reach",
    title: "Abyssal Reach",
    description: "Dive into the unknown depths of humanity.",
    imageUrl: "https://placehold.co/800x800/1d1a25/ffffff/png?text=Abyssal+Reach",
    imageAlt: "Sprawling panoramic shot of a deep-sea research station glowing with blue lights.",
    size: "large",
  },
  {
    id: "dune-walker",
    title: "Dune Walker",
    imageUrl: "https://placehold.co/400x400/7b2900/ffffff/png?text=Dune+Walker",
    imageAlt: "Minimalist desert landscape at dawn with sand dunes sculpted by wind.",
    size: "small",
  },
  {
    id: "neon-pulse",
    title: "Neon Pulse",
    imageUrl: "https://placehold.co/400x400/5400c3/ffffff/png?text=Neon+Pulse",
    imageAlt: "Cyberpunk studio portrait of a woman illuminated by soft violet lights.",
    size: "small",
  },
  {
    id: "star-voyager-genesis",
    title: "Star Voyager: Genesis",
    description: "The journey begins July 20th",
    imageUrl: "https://placehold.co/800x400/7000ff/ffffff/png?text=Star+Voyager",
    imageAlt: "Dynamic wide-angle shot of a spaceship entering a colorful nebula.",
    size: "medium",
    releaseDate: "July 20th",
  },
];

export const GENRES: GenreCard[] = [
  { icon: "Bolt", label: "Action" },
  { icon: "Smile", label: "Comedy" },
  { icon: "Rocket", label: "Sci-Fi" },
  { icon: "Skull", label: "Horror" },
  { icon: "Heart", label: "Romance" },
  { icon: "Drama", label: "Drama" },
];

export const COMING_SOON_MOVIES: ComingSoonMovie[] = [
  {
    id: "the-synthetic-mind",
    title: "The Synthetic Mind",
    releaseDate: "Releasing on Dec 15, 2024",
    imageUrl: "https://placehold.co/400x600/5400c3/ffffff/png?text=Synthetic+Mind",
    imageAlt: "Movie teaser poster featuring a close-up of a high-tech robotic eye.",
    genres: ["Sci-Fi"],
    languages: ["English"],
  },
  {
    id: "sky-kingdoms",
    title: "Sky Kingdoms",
    releaseDate: "Releasing on Jan 05, 2025",
    imageUrl: "https://placehold.co/400x600/7b2900/ffffff/png?text=Sky+Kingdoms",
    imageAlt: "Teaser image of a majestic mountain range at night under multiple moons.",
    genres: ["Fantasy"],
    languages: ["English"],
  },
];
