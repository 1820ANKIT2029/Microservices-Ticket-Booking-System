// ── Homepage / catalog event types ──────────────────────────────────────────

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  imageUrl: string;
  imageAlt: string;
  gradient: string;
  badge?: string;
}

export interface Team {
  name: string;
  initials: string;
  logoUrl: string;
  gradient: string;
  logoAlt: string;
}

export interface SportsMatch {
  id: string;
  league: string;
  status: "live" | "upcoming";
  time?: string;
  venue?: string;
  homeTeam: Team;
  awayTeam: Team;
  score?: string;
}

export interface Concert {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  gradient: string;
  badge?: string;
  variant: "featured" | "compact";
}

export interface Step {
  icon: string;
  title: string;
  description: string;
  bgClass: string;
  iconColorClass: string;
}

// ── Event detail / checkout types ───────────────────────────────────────────

export interface EventArtist {
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventOffer {
  title: string;
  description: string;
  icon: string;
}

export interface EventVenueInfo {
  name: string;
  address: string;
  mapImageUrl: string;
  mapImageAlt: string;
  directions: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  dateText: string;
  time: string;
  venue: EventVenueInfo;
  imageUrl: string;
  imageAlt: string;
  heroGradient: string;
  description: string;
  longDescription: string;
  ticketPrice: number;
  ticketType: string;
  availableSeats: number;
  artists?: EventArtist[];
  faqs?: EventFAQ[];
  offers?: EventOffer[];
  guidelines?: string[];
}

// ── Event Service Microservice DTOs (port 8081) ─────────────────────────────

export interface SeatDTO {
  id?: number;
  venueSectionId?: number;
  venueId?: number;
  seatNumber: string;
  rowLabel?: string;
  seatType?: string;
  svgElementId?: string;
  isAccessible?: boolean;
  isActive?: boolean;
}

export interface VenueDTO {
  id?: number;
  name: string;
  description?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  longitude?: number;
  latitude?: number;
  timezone?: string;
  totalCapacity?: number;
  websiteUrl?: string;
  svgTemplateUrl?: string;
  amenities?: string;
  isActive?: boolean;
  createdAt?: string;
  sections?: VenueSectionDTO[];
}

export interface VenueSectionDTO {
  id?: number;
  venueId?: number;
  name: string;
  description?: string;
  sectionType?: string;
  totalSeats?: number;
  rowCount?: number;
  seatsPerRow?: number;
  svgElementId?: string;
  seats?: SeatDTO[];
}

export interface SessionSeatDTO {
  id?: number;
  eventSessionId?: number;
  seatId?: number;
  ticketTypeDTO?: TicketTypeDTO;
  overridePrice?: number;
  status?: "AVAILABLE" | "RESERVED" | "SOLD";
}

export interface TicketTypeDTO {
  id?: number;
  eventId?: number;
  eventSessionId?: number;
  name: string;
  description?: string;
  basePrice: number;
  totalQuantity: number;
  availableQuantity: number;
  maxPerBooking: number;
  isActive?: boolean;
  saleStartAt?: string;
  saleEndAt?: string;
}

export interface PerformerDTO {
  id?: number;
  name: string;
  bio?: string;
  genre?: string;
  nationality?: string;
  websiteUrl?: string;
  imageUrl?: string;
  socialLink1?: string;
  socialLink2?: string;
  isActive?: boolean;
  createdAt?: string;
  modifiedAt?: string;
}

export interface EventDTO {
  id?: number;
  title: string;
  slug: string;
  description?: string;
  status?: string;
  eventType?: string;
  minAge?: number;
  venueId: number;
  bannerUrl?: string;
  posterUrl?: string;
  isMultiSession?: boolean;
  isFeatured?: boolean;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
  performers?: PerformerDTO[];
  sessions?: EventSessionDTO[];
  ticketTypes?: TicketTypeDTO[];
}

export interface EventSessionDTO {
  id?: number;
  eventId?: number;
  venueId?: number;
  title: string;
  description?: string;
  status?: string;
  streamUrl?: string;
  language?: string;
  totalCapacity?: number;
  availableCapacity?: number;
  sessionNumber: number;
  isRecorded?: boolean;
  startDataTime?: string;
  endDataTime?: string;
  createdAt?: string;
}

