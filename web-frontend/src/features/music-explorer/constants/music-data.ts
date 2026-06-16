import type { TourArtist, UpcomingGig, SpotlightFestival } from "../types/music";

export const HERO_FESTIVAL = {
  id: "sunburn-festival-2024",
  title: "Sunburn Festival 2024",
  badge: "Featured Festival",
  description: "Experience the world's leading EDM artists under the Goan sun. 3 Days, 5 Stages, 100+ Artists.",
  dateText: "Dec 28 - Dec 30, 2024",
  locationText: "Vagator, Goa",
  imageUrl: "https://placehold.co/1920x1080/1d1a25/ffffff/png?text=Sunburn+Festival+2024+Backdrop",
  imageAlt: "A massive outdoor music festival stage at night with professional purple and electric blue lighting.",
};

export const MUSIC_GENRES = [
  "All Genres",
  "Rock",
  "Pop",
  "EDM",
  "Jazz",
  "Classical",
  "Hip-Hop",
];

export const WORLD_TOURS: TourArtist[] = [
  {
    id: "taylor-swift",
    name: "Taylor Swift",
    tourName: "The Eras Tour",
    imageUrl: "https://placehold.co/600x800/7000ff/ffffff/png?text=Taylor+Swift",
    imageAlt: "Golden backlit stage portrait of a female pop artist singing into a sparkling microphone.",
    details: "45 Countries • 120 Shows",
    badgeClass: "bg-tertiary-container text-on-tertiary",
  },
  {
    id: "coldplay",
    name: "Coldplay",
    tourName: "Music of the Spheres",
    imageUrl: "https://placehold.co/600x800/00d1ff/ffffff/png?text=Coldplay",
    imageAlt: "Stadium shot of a legendary rock band playing under floating glowing LED spheres.",
    details: "Global Stadium Tour",
    badgeClass: "bg-secondary-container text-on-secondary-container",
  },
  {
    id: "ed-sheeran",
    name: "Ed Sheeran",
    tourName: "The Mathematics Tour",
    imageUrl: "https://placehold.co/600x800/ff3d00/ffffff/png?text=Ed+Sheeran",
    imageAlt: "Warm acoustic performance of solo male artist in an amphitheater.",
    details: "North American Leg",
    badgeClass: "bg-primary-container text-on-primary-container",
  },
];

export const UPCOMING_GIGS: UpcomingGig[] = [
  {
    id: "neon-pulse-night",
    title: "Neon Pulse Night",
    venue: "The Blue Basement",
    price: "$25",
    dateMonth: "SEP",
    dateDay: "15",
    imageUrl: "https://placehold.co/600x400/5400c3/ffffff/png?text=Neon+Pulse+Night",
    imageAlt: "DJ booth with neon purple lights and dancing crowd.",
  },
  {
    id: "midnight-jazz-sessions",
    title: "Midnight Jazz Sessions",
    venue: "Velvet Lounge",
    price: "$40",
    dateMonth: "SEP",
    dateDay: "18",
    imageUrl: "https://placehold.co/600x400/7b2900/ffffff/png?text=Jazz+Session",
    imageAlt: "Jazz saxophonist in spotlight with warm amber lighting.",
  },
  {
    id: "electric-static-live",
    title: "Electric Static Live",
    venue: "Warehouse 7",
    price: "$15",
    dateMonth: "SEP",
    dateDay: "22",
    imageUrl: "https://placehold.co/600x400/ba1a1a/ffffff/png?text=Electric+Static+Live",
    imageAlt: "Rock guitarist jumping in mid-air in front of strobe stage lights.",
  },
  {
    id: "echoes-in-the-garden",
    title: "Echoes in the Garden",
    venue: "Botanic Amphitheatre",
    price: "$35",
    dateMonth: "SEP",
    dateDay: "25",
    imageUrl: "https://placehold.co/600x400/007f5f/ffffff/png?text=Echoes+In+Garden",
    imageAlt: "Acoustic singer performing keyboard outdoors under hanging lights.",
  },
];

export const FESTIVAL_SPOTLIGHTS: SpotlightFestival[] = [
  {
    id: "lollapalooza-2024",
    title: "Lollapalooza 2024",
    dates: "Dec 12 - 15",
    description: "A multi-genre musical extravaganza featuring international icons and rising indie stars across four massive stages.",
    imageUrl: "https://placehold.co/600x600/5400c3/ffffff/png?text=Lollapalooza+2024",
    imageAlt: "Multi-day music festival sunset scene showing stages and camping grounds.",
  },
  {
    id: "edc-2024",
    title: "Electric Daisy Carnival",
    dates: "Nov 20 - 22",
    description: "Enter a world of kinetic energy and immersive art at the world's most innovative dance music experience.",
    imageUrl: "https://placehold.co/600x600/00d1ff/ffffff/png?text=EDC+Festival",
    imageAlt: "Dance music festival stage with high-tech laser arrays in purple and cyan.",
  },
];
