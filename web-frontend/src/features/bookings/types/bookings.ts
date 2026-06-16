export interface Booking {
  id: string;
  title: string;
  category: "Movies" | "Sports" | "Music" | "Concerts" | string;
  status: "confirmed" | "completed" | "cancelled";
  dateText: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  pricePaid?: string;
}

export interface LoyaltyStats {
  points: number;
  targetPoints: number;
  attendedCount: number;
}
