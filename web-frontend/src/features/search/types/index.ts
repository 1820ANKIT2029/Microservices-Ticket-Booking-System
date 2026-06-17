// ── API DTOs ──────────────────────────────────────────────────────────────────

export interface SearchResultEventDto {
  id:        string;
  title:     string;
  category:  string;
  price:     number;
  priceText: string;
  date:      string;
  dateText:  string;
  location:  string;
  imageUrl:  string;
  imageAlt:  string;
  venue:     string;
}

export interface SearchRequestDto {
  q:          string;
  categories?: string;
  dates?:      string;
  maxPrice?:   number;
  venue?:      string | null;
}

// ── Domain Model ──────────────────────────────────────────────────────────────

export interface SearchResultEvent {
  id:        string;
  title:     string;
  category:  string;
  price:     number;
  priceText: string;
  date:      string;
  dateText:  string;
  location:  string;
  imageUrl:  string;
  imageAlt:  string;
  venue:     string;
}

export interface SearchFilters {
  categories: string[];
  dates:      string[];
  maxPrice:   number;
  venue:      string | null;
}
