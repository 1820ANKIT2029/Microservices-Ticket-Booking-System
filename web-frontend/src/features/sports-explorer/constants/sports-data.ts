import type { LiveScore, SportCategory, SportEvent, LocalMatch } from "../types/sports";

export const HERO_SPORTS_EVENT = {
  id: "icc-champions-trophy-2025",
  title: "ICC Champions Trophy 2025",
  badge: "MAJOR TOURNAMENT",
  description: "The quest for glory begins. Register for early bird access now.",
  imageUrl: "https://placehold.co/1920x1080/0f172a/ffffff/png?text=ICC+Champions+Trophy+2025",
  imageAlt: "A scenic wide shot of a cricket stadium filled with a cheering crowd under massive floodlights.",
};

export const LIVE_SCORES: LiveScore[] = [
  {
    id: "ind-vs-aus-1st-test",
    matchName: "IND vs AUS • 1st Test",
    sportType: "Cricket",
    team1: "India",
    team1Score: "284/4 (82)",
    team2: "Australia",
    team2Score: "Yet to bat",
    status: "LIVE",
    detail: "Kohli 102*, Rahul 54. Tea Break.",
  },
  {
    id: "isl-mumbai-vs-kerala",
    matchName: "ISL • Mumbai City vs Kerala",
    sportType: "Football",
    team1: "Mumbai City",
    team1Score: "2",
    team2: "Kerala Blasters",
    team2Score: "1",
    status: "LIVE",
    detail: "78th Minute • Corner for Kerala",
  },
  {
    id: "atp-sinner-vs-alcaraz",
    matchName: "ATP • Sinner vs Alcaraz",
    sportType: "Tennis",
    team1: "J. Sinner",
    team1Score: "6 | 4 | 15",
    team2: "C. Alcaraz",
    team2Score: "4 | 6 | 40",
    status: "LIVE",
    detail: "Set 3 • Game 3 • Deuce",
  },
];

export const SPORT_CATEGORIES: SportCategory[] = [
  { id: "cricket", label: "Cricket", iconName: "sports_cricket" },
  { id: "football", label: "Football", iconName: "sports_soccer" },
  { id: "tennis", label: "Tennis", iconName: "sports_tennis" },
  { id: "f1", label: "F1", iconName: "sports_motorsports" },
  { id: "basketball", label: "Basketball", iconName: "sports_basketball" },
  { id: "kabaddi", label: "Kabaddi", iconName: "sports_kabaddi" },
  { id: "all-sports", label: "All Sports", iconName: "grid_view" },
];

export const TRENDING_SPORTS_EVENTS: SportEvent[] = [
  {
    id: "border-gavaskar-trophy-day-2",
    title: "Border-Gavaskar Trophy: Day 2",
    category: "CRICKET",
    location: "Wankhede Stadium, Mumbai",
    date: "Nov 23, 2024",
    priceText: "₹1,200 onwards",
    tagType: "primary",
    imageUrl: "https://placehold.co/600x400/5400c3/ffffff/png?text=Border-Gavaskar+Trophy",
    imageAlt: "Close-up of a red leather cricket ball resting on a grassy stadium pitch.",
  },
  {
    id: "ipl-2025-final-booking",
    title: "IPL 2025 Final - Booking Interest",
    category: "IPL 2025",
    location: "Eden Gardens, Kolkata",
    date: "May 2025",
    priceText: "Early Bird Open",
    tagType: "tertiary",
    imageUrl: "https://placehold.co/600x400/7b2900/ffffff/png?text=IPL+Finals+2025",
    imageAlt: "A glowing cricket stadium at night under bright arena lighting.",
  },
  {
    id: "mumbai-city-fc-vs-mohun-bagan",
    title: "Mumbai City FC vs Mohun Bagan",
    category: "FOOTBALL",
    location: "DY Patil Stadium, Navi Mumbai",
    date: "Dec 05, 2024",
    priceText: "Filling Fast",
    tagType: "secondary",
    imageUrl: "https://placehold.co/600x400/585e6f/ffffff/png?text=ISL+Football+Match",
    imageAlt: "Two soccer players contesting for a ball on a green grass field.",
  },
];

export const LOCAL_MATCHES: LocalMatch[] = [
  {
    id: "local-club-cricket-final",
    title: "Local Club Cricket Final",
    location: "Shivaji Park, Mumbai",
    date: "Tomorrow",
    priceText: "Free Entry",
    isFree: true,
  },
  {
    id: "inter-city-tennis-open",
    title: "Inter-City Tennis Open",
    location: "CCI Courts",
    date: "Nov 25-27",
    priceText: "₹200",
  },
  {
    id: "maharashtra-kabaddi-league",
    title: "Maharashtra Kabaddi League",
    location: "Sardar Vallabhbhai Patel Stadium",
    date: "Dec 01",
    priceText: "₹300 onwards",
  },
];

export const RECOMMENDED_SPORTS_EVENTS: SportEvent[] = [
  {
    id: "sa-vs-ind-t20-series",
    title: "South Africa vs India T20 Series",
    category: "CRICKET",
    location: "Durban",
    date: "Dec 10, 2024",
    priceText: "₹1,500 onwards",
    tagType: "primary",
    imageUrl: "https://placehold.co/600x400/5400c3/ffffff/png?text=SA+vs+IND+T20",
    imageAlt: "T20 Cricket match action featuring batsman hitting a shot.",
  },
  {
    id: "ipl-finals-2025-early-bird",
    title: "IPL Finals 2025 - Early Bird",
    category: "IPL",
    location: "Multiple Venues",
    date: "May 2025",
    priceText: "Sign Up Open",
    tagType: "tertiary",
    imageUrl: "https://placehold.co/600x400/7b2900/ffffff/png?text=IPL+Early+Bird",
    imageAlt: "Trophy of IPL glowing on a pedestal under spot lighting.",
  },
  {
    id: "isl-finals-mumbai-city-fc",
    title: "ISL Finals - Mumbai City FC",
    category: "FOOTBALL",
    location: "DY Patil Stadium",
    date: "Jan 15, 2025",
    priceText: "₹500 onwards",
    tagType: "secondary",
    imageUrl: "https://placehold.co/600x400/585e6f/ffffff/png?text=ISL+Finals",
    imageAlt: "A football net in front of stadium seats during sunset.",
  },
  {
    id: "atp-mumbai-open-qualifiers",
    title: "ATP - Mumbai Open Qualifiers",
    category: "TENNIS",
    location: "Mumbai",
    date: "Feb 02, 2025",
    priceText: "₹300 onwards",
    tagType: "secondary",
    imageUrl: "https://placehold.co/600x400/585e6f/ffffff/png?text=ATP+Mumbai+Open",
    imageAlt: "A yellow tennis ball resting on a blue hard court boundary line.",
  },
];
