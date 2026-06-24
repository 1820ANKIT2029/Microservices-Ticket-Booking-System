export interface VenueModel {
  id: number | string;
  name: string;
  totalCapacity: number;
  isActive: boolean;
  city?: string;
  country?: string;
  mapWidth?: number;
  mapHeight?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const isVenueAvailable = (v: VenueModel) => v.isActive;
export const getLocationString = (v: VenueModel) =>
  [v.city, v.country].filter(Boolean).join(", ");
