export interface EventModel {
  id: number | string;
  title: string;
  status: string;
  eventType: string;
  slug?: string;
  bannerUrl?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  performers?: any[];
}

export const isPublished = (e: EventModel) => e.status === "PUBLISHED";
export const isFeaturedEvent = (e: EventModel) => !!e.isFeatured;
export const getDisplayTitle = (e: EventModel) => e.title.trim();
