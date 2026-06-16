export interface TourArtist {
  id: string;
  name: string;
  tourName: string;
  imageUrl: string;
  imageAlt: string;
  details: string;
  badgeClass: string;
}

export interface UpcomingGig {
  id: string;
  title: string;
  venue: string;
  price: string;
  dateMonth: string;
  dateDay: string;
  imageUrl: string;
  imageAlt: string;
}

export interface SpotlightFestival {
  id: string;
  title: string;
  description: string;
  dates: string;
  imageUrl: string;
  imageAlt: string;
}
