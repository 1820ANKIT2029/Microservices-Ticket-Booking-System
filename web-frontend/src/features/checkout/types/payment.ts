export interface BookingPaymentRequestDTO {
  bookingId: number;
  userId: string;
  amount: number;
  currencyCode: string;
}

export interface PaymentDTO {
  id: number;
  gatewayName: string;
  gatewayPaymentId: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  gatewayResponse: string;
  bookingId: number;
  userId: string;
  completedId: string;
  initiatedAt: string;
  gatewayPublicApiKey?: string;
}

export interface PagePaymentDTO {
  totalElements: number;
  totalPages: number;
  size: number;
  content: PaymentDTO[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
