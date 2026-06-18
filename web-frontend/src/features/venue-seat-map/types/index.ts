// ─── API / DTO Types ──────────────────────────────────────────────────────────

export interface VenueMapDTO {
  id: number;
  name: string;
  mapWidth?: number;
  mapHeight?: number;
}

export interface VenueSectionMapDTO {
  id: number;
  venueId: number;
  name: string;
  sectionType?: string;
  totalSeats?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  seats?: SeatDTO[];
}

export interface SeatDTO {
  id: number;
  venueId: number;
  venueSectionId: number;
  rowLabel?: string;
  seatNumber: string;
  seatType?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  shape?: "circle" | "rectangle";
  isAccessible?: boolean;
  isActive?: boolean;
}

// ─── Create / Update payloads ─────────────────────────────────────────────────

export type CreateVenueSectionPayload = Omit<VenueSectionMapDTO, "id" | "seats">;
/** Full section body for PUT — backend modifyVenueSection accepts VenueSectionDTO */
export type UpdateVenueSectionPayload = Partial<VenueSectionMapDTO>;

export type CreateSeatPayload = Omit<SeatDTO, "id">;
/** Full seat body for PUT — backend modifySeat accepts full SeatDTO including id/venueId/venueSectionId */
export type UpdateSeatPayload = Partial<SeatDTO>;

// ─── Local editor state types ─────────────────────────────────────────────────

export type SeatShape = "circle" | "rectangle";

export type SeatType = "STANDARD" | "PREMIUM" | "VIP" | "ECONOMY";

/** A seat as it lives in the editor canvas (may not yet be saved to backend) */
export interface LocalSeat {
  /** Negative IDs = unsaved (temp client-side id) */
  id: number;
  venueId: number;
  venueSectionId: number;
  rowLabel: string;
  seatNumber: string;
  seatType: SeatType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: SeatShape;
  isAccessible: boolean;
  isActive: boolean;
}

/** A section as it lives in the editor canvas */
export interface LocalSection {
  /** Negative IDs = unsaved (temp client-side id) */
  id: number;
  venueId: number;
  name: string;
  sectionType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  seats: LocalSeat[];
}

/** Top-level venue state held in the editor */
export interface LocalVenue {
  id: number | null;
  name: string;
  mapWidth: number;
  mapHeight: number;
  sections: LocalSection[];
}

// ─── Seat generation config ───────────────────────────────────────────────────

export interface SeatGenerationConfig {
  rows: number;
  seatsPerRow: number;
  horizontalGap: number;
  verticalGap: number;
  seatWidth: number;
  seatHeight: number;
  seatShape: SeatShape;
  startRowLabel: string;
  seatType: SeatType;
}

// ─── Editor UI state ──────────────────────────────────────────────────────────

export interface EditorState {
  selectedSectionId: number | null;
  selectedSeatIds: number[];
  isGenerateModalOpen: boolean;
  isSaving: boolean;
}

// ─── Viewer state ─────────────────────────────────────────────────────────────

export interface ViewerState {
  selectedSeatIds: number[];
}
