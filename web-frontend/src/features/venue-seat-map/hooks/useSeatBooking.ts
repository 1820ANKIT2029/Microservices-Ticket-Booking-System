import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VenueSeatMapService } from "@/features/venue-seat-map/api/service";
import { api as axios } from "@/shared/api";
import { PaymentService } from "@/shared/api/services";
import type { BookingResponseDTO, SessionSeatDTO, LocalSeat } from "../types";
import type { TicketTypeResponseDto } from "@/features/events/types";
import { useAuthStore } from "@/shared/store/auth.store";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useSeatBooking({
  eventId,
  sessionId,
  venue,
  sessionSeats,
  ticketTypes,
}: {
  eventId: string;
  sessionId?: string;
  venue: any;
  sessionSeats: SessionSeatDTO[];
  ticketTypes: TicketTypeResponseDto[];
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isProceeding, setIsProceeding] = useState(false);

  const handleProceed = useCallback(async (selectedSeatIds: number[]) => {
    if (selectedSeatIds.length === 0 || !sessionId) return;

    setIsProceeding(true);
    const toastId = toast.loading("Booking your selected seats...");

    try {
      const seats = venue.sections.flatMap((s: any) => s.seats);
      const selected = seats.filter((s: any) => selectedSeatIds.includes(s.id));
      
      const bookingRef = crypto.randomUUID();
      const userId = user?.userId || "1";
      const eventSessionId = Number(sessionId);

      const seatsPayload = selected.map((seat: any) => {
        const sSeat = sessionSeats.find((ss) => ss.seatId === Number(seat.id));
        const section = venue.sections.find((s: any) => s.seats.some((seatItem: any) => seatItem.id === seat.id));
        const ticketType = section ? ticketTypes.find((t) => t.venueSectionIds?.includes(section.id)) : undefined;

        return {
          sessionSeatId: sSeat ? Number(sSeat.id) : 0,
          eventSessionId: Number(sessionId),
          seatId: Number(seat.id),
          ticketTypeId: ticketType ? Number(ticketType.id) : 0,
        };
      });

      const bookingPayload = {
        bookingRef,
        userId,
        eventSessionId,
        seats: seatsPayload,
      };

      const bookingRes = await VenueSeatMapService.createEventBooking(bookingPayload) as unknown as BookingResponseDTO;

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error("Failed to load Razorpay Payment Gateway SDK.", { id: toastId });
        return;
      }

      toast.success("Connecting to Razorpay Secure...", { id: toastId });


      const options = {
        key: bookingRes.gatewayPublicApiKey || "rzp_test_dummy",
        amount: Math.round(Number(bookingRes.totalAmount) * 100),
        currency: bookingRes.currency || "INR",
        name: "EventPass",
        description: `Booking Reference: ${bookingRes.bookingRef}`,
        order_id: (bookingRes as any).gatewayOrderId || (bookingRes as any).razorpayOrderId,
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
        handler: async function (response: any) {
          try {
            await PaymentService.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            toast.success("Payment Successful!");
            router.push(`/checkout/confirmed?bookingId=${bookingRes.id}`);
          } catch (err: any) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Guest Customer",
          email: user?.email || "guest@example.com",
          contact: user?.phoneNumber || "",
        },
        notes: {
          bookingRef: bookingRes.bookingRef,
          bookingId: String(bookingRes.id),
        },
        theme: {
          color: "#5400c3",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Failed to book seats:", err);
      toast.error(err.message || "Failed to book seats. They may have already been taken.", { id: toastId });
    } finally {
      setIsProceeding(false);
    }
  }, [venue.sections, eventId, sessionId, sessionSeats, ticketTypes, user, router]);

  return { isProceeding, handleProceed };
}
