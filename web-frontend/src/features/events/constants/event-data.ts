import type { EventDetail } from "../types/event-detail";

export const DEFAULT_EVENT_DETAIL: EventDetail = {
  id: "mumbai-city-fc-vs-mohun-bagan",
  title: "IPL 2025: Mumbai City FC vs Mohun Bagan",
  category: "IPL 2025 / FOOTBALL RIVALRY",
  dateText: "Sat, 24 May 2025",
  timeText: "07:30 PM Onwards",
  locationText: "DY Patil Stadium, Mumbai",
  priceText: "₹1,200 onwards",
  imageUrl: "https://placehold.co/1920x1080/0f172a/ffffff/png?text=Mumbai+City+FC+vs+Mohun+Bagan",
  imageAlt: "A wide-angle landscape shot of a massive, modern stadium packed with thousands of fans under bright evening floodlights.",
  descriptionParagraphs: [
    "Get ready for an explosive showdown as Mumbai City FC hosts the legendary Mohun Bagan in what promises to be the marquee clash of the IPL 2025 season. The rivalry that has defined Indian football takes center stage at the iconic DY Patil Stadium, where passion, speed, and tactical brilliance collide.",
    "Expect a high-octane atmosphere with both teams fighting for the top spot on the leaderboard. With world-class strikers and rock-solid defenses, this match is more than just a game—it's a quest for glory. Don't miss your chance to witness history in the making.",
  ],
  lineup: [
    {
      name: "Rahul Bheke",
      role: "Defender / Captain",
      imageUrl: "https://placehold.co/300x300/5400c3/ffffff/png?text=Rahul+Bheke",
      imageAlt: "Studio portrait of Rahul Bheke, defender and captain.",
    },
    {
      name: "Liston Colaco",
      role: "Forward / Key Winger",
      imageUrl: "https://placehold.co/300x300/7b2900/ffffff/png?text=Liston+Colaco",
      imageAlt: "Studio portrait of Liston Colaco, forward and key winger.",
    },
    {
      name: "Lallianzuala Chhangte",
      role: "Winger / Playmaker",
      imageUrl: "https://placehold.co/300x300/585e6f/ffffff/png?text=L+Chhangte",
      imageAlt: "Studio portrait of Lallianzuala Chhangte, winger and playmaker.",
    },
    {
      name: "Subhasish Bose",
      role: "Defender / Left-back",
      imageUrl: "https://placehold.co/300x300/171f33/ffffff/png?text=Subhasish+Bose",
      imageAlt: "Studio portrait of Subhasish Bose, defender and left-back.",
    },
  ],
  venue: {
    name: "DY Patil Stadium",
    address: "Sector 7, Nerul, Navi Mumbai, Maharashtra 400706",
    transitInfo: "10 mins walk from Nerul Railway Station. Proximity to Sion-Panvel Expressway.",
    mapImageUrl: "https://placehold.co/600x400/1e293b/ffffff/png?text=DY+Patil+Stadium+Map",
    mapImageAlt: "A satellite map view of DY Patil Stadium and surrounding streets in Navi Mumbai.",
    locationName: "Nerul, Navi Mumbai",
  },
  offers: [
    {
      code: "EVENT25",
      discountText: "25% OFF",
      description: "Use code on HDFC Bank Credit Cards. Max discount ₹500.",
    },
    {
      code: "FIRSTBKG",
      discountText: "₹100 OFF",
      description: "Valid on your first booking with EventPass.",
    },
  ],
  guidelines: [
    {
      iconName: "Info",
      label: "Age Limit: 3+ years and above.",
    },
    {
      iconName: "CameraOff",
      label: "Professional cameras not allowed.",
    },
    {
      iconName: "Clock",
      label: "Gates open 2 hours before kickoff.",
    },
    {
      iconName: "FileText",
      label: "E-tickets must be exchanged at box office.",
    },
  ],
};

export const RECOMMENDED_EVENTS = [
  {
    id: "sunburn-arena-alesso",
    title: "Sunburn Arena: Alesso",
    category: "CONCERT",
    location: "Jio World Garden, Mumbai",
    priceText: "₹2,499 onwards",
    imageUrl: "https://placehold.co/600x400/5400c3/ffffff/png?text=Alesso+Sunburn",
    imageAlt: "Vibrant concert scene with colorful stage lights flashing over a cheering crowd.",
  },
  {
    id: "t20-india-vs-australia",
    title: "T20: India vs Australia",
    category: "CRICKET",
    location: "Wankhede Stadium, Mumbai",
    priceText: "₹1,500 onwards",
    imageUrl: "https://placehold.co/600x400/7b2900/ffffff/png?text=IND+vs+AUS",
    imageAlt: "Daytime sports shot of a cricket stadium with green pitch and blue sky.",
  },
  {
    id: "deep-house-nights",
    title: "Deep House Nights",
    category: "MUSIC",
    location: "Trilogy, Juhu",
    priceText: "₹1,000 onwards",
    imageUrl: "https://placehold.co/600x400/585e6f/ffffff/png?text=Deep+House",
    imageAlt: "Sophisticated DJ booth at a premium lounge with city skyline backdrop.",
  },
];
