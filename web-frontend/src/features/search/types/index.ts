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

export interface VenueSearchResponse {
  id: number;
  name: string;
}

export interface PageVenueSearchResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: VenueSearchResponse[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface EventSearchResponse {
  id: number;
  title: string;
  slug: string;
  eventType: string;
  status: string;
  bannerUrl?: string;
  isFeatured: boolean;
}

export interface PageEventSearchResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: EventSearchResponse[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
