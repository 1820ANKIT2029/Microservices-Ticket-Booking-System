export interface CheckoutEvent {
  id: string;
  title: string;
  dateText: string;
  ticketType: string;
  basePrice: number;
  imageUrl: string;
  imageAlt: string;
}

export interface OrderBreakdown {
  basePrice: number;
  qty: number;
  baseFareTotal: number;
  bookingFee: number;
  taxesGst: number;
  totalAmount: number;
}
