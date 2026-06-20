export interface CastMember {
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
}

export interface VenueInfo {
  name: string;
  address: string;
  transitInfo: string;
  mapImageUrl: string;
  mapImageAlt: string;
  locationName: string;
}

export interface OfferCoupon {
  code: string;
  discountText: string;
  description: string;
}

export interface GuidelineItem {
  iconName: string;
  label: string;
}

export interface EventDetail {
  id: string;
  title: string;
  category: string;
  dateText: string;
  timeText: string;
  locationText: string;
  priceText: string;
  descriptionParagraphs: string[];
  lineup: CastMember[];
  venue: VenueInfo;
  offers: OfferCoupon[];
  guidelines: GuidelineItem[];
  imageUrl: string;
  imageAlt: string;
}
