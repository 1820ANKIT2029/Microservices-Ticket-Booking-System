export interface SearchResultEvent {
  id: string;
  title: string;
  category: "Sports" | "Music" | "Arts" | "Food" | "Training" | string;
  price: number;
  priceText: string;
  date: string; // ISO String format for easy transport & comparison
  dateText: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  venue: string;
}

export interface SearchFilters {
  categories: string[];
  dates: string[];
  maxPrice: number;
  venue: string | null;
}
