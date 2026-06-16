export interface HeroMovie {
  id: string;
  title: string;
  badge: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface TrendingMovie {
  id: string;
  title: string;
  genre: string;
  formatOrLanguage: string;
  imageUrl: string;
  imageAlt: string;
  rating: string;
}

export interface RecommendedMovie {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  size: "large" | "small" | "medium";
  releaseDate?: string;
}

export interface GenreCard {
  icon: string;
  label: string;
}

export interface ComingSoonMovie {
  id: string;
  title: string;
  releaseDate: string;
  imageUrl: string;
  imageAlt: string;
  genres: string[];
  languages: string[];
}
