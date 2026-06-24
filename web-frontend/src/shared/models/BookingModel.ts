export interface BookingModel {
  id: string | number;
  eventId: string;
  userId: string;
  status: string;
  qty: number;
  totalAmount: number;
  seats: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const isConfirmed = (b: BookingModel) => b.status === "CONFIRMED";
export const isPending = (b: BookingModel) => b.status === "PENDING";
export const canBeCancelled = (b: BookingModel) =>
  b.status === "PENDING" || b.status === "CONFIRMED";
