export interface LiveScore {
  id: string;
  matchName: string;
  sportType: string;
  team1: string;
  team1Score: string;
  team2: string;
  team2Score: string;
  status: "LIVE" | "UPCOMING" | "FINISHED";
  detail: string;
}

export interface SportCategory {
  id: string;
  label: string;
  iconName: string;
}

export interface SportEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  priceText: string;
  tagType: "primary" | "secondary" | "tertiary";
  imageUrl: string;
  imageAlt: string;
}

export interface LocalMatch {
  id: string;
  title: string;
  location: string;
  date: string;
  priceText: string;
  isFree?: boolean;
}
