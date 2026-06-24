import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type {
  BookingResponseDto,
  CreateBookingRequestDto,
  BookingRequestDTO,
  BookingDTO,
  TicketDTO,
  PageBookingDTO,
} from "@/features/bookings/types";

/**
 * BookingService — centralized HTTP calls for bookings and tickets.
 */
export class BookingService {

  static getEventBooking(bookingId: number | string) {
    return api
      .get<ApiResponse<BookingDTO>>(`/booking/api/bookings/${bookingId}`)
      .then((res) => res.data.data);
  }

  static getBookings(page = 0, size = 10, sort?: string[]): Promise<{
    content: BookingResponseDto[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }> {
    return api
      .get<ApiResponse<PageBookingDTO>>("/booking/api/bookings", {
        params: { page, size, sort: sort?.join(",") },
      })
      .then((res) => {
        const pageData = res.data.data;
        const content = pageData.content || [];
        const mappedContent = content.map((b) => ({
          id: String(b.id),
          eventId: String(b.eventSessionId),
          userId: b.userId,
          status: b.status,
          qty: b.ticketCount,
          totalAmount: b.totalAmount,
          seats: b.tickets?.map((t) => String(t.sessionSeatId)) || [],
          createdAt: b.createdAt,
        })) as unknown as BookingResponseDto[];

        return {
          content: mappedContent,
          totalPages: pageData.totalPages,
          totalElements: pageData.totalElements,
          size: pageData.size,
          number: pageData.number,
          first: pageData.first,
          last: pageData.last,
        };
      });
  }

  static createBooking(data: BookingRequestDTO): Promise<BookingDTO>;
  static createBooking(data: CreateBookingRequestDto): Promise<BookingResponseDto>;
  static createBooking(data: CreateBookingRequestDto | BookingRequestDTO): Promise<any> {
    if ("bookingRef" in data) {
      return api
        .post<ApiResponse<BookingDTO>>("/booking/api/bookings", data)
        .then((res) => res.data.data);
    }
    const adaptedData: BookingRequestDTO = {
      bookingRef: `BK-${Date.now()}`,
      eventSessionId: Number(data.eventId),
      seats: data.seats.map((seatId) => ({
        sessionSeatId: Number(seatId),
        eventSessionId: Number(data.eventId),
        seatId: Number(seatId),
        ticketTypeId: 1,
      })),
    };
    return api
      .post<ApiResponse<BookingDTO>>("/booking/api/bookings", adaptedData)
      .then((res) => {
        return res.data.data;
      });
  }

  static deleteBooking(id: string) {
    return Promise.resolve(null);
  }

  static getBooking(bookingId: number | string) {
    return api
      .get<ApiResponse<BookingDTO>>(`/booking/api/bookings/${bookingId}`)
      .then((res) => res.data.data);
  }

  static getTicketsOfBooking(bookingId: number | string, userId: string) {
    return api
      .get<ApiResponse<TicketDTO[]>>(`/booking/api/bookings/${bookingId}/tickets`, {
        headers: { "X-User-Id": userId },
      })
      .then((res) => res.data.data);
  }
}
