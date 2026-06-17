import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { CreateBookingRequestDto } from "@/features/bookings/types";

export class CheckoutService {
  /**
   * Validates a booking session before finalizing payment.
   */
  static validateSession(eventId: string, seats: string[]) {
    return api
      .post<ApiResponse<boolean>>("/checkout/validate", { eventId, seats })
      .then((res) => res.data.data);
  }

  /**
   * Process payment and finalize booking.
   * Returns a transaction reference ID.
   */
  static processPayment(bookingData: CreateBookingRequestDto, paymentToken: string) {
    return api
      .post<ApiResponse<{ transactionId: string }>>("/checkout/process", {
        ...bookingData,
        paymentToken,
      })
      .then((res) => res.data.data);
  }
}
