"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentSection } from "./payment-section";
import { OrderSummary } from "./order-summary";
import { MobileBottomBar } from "./mobile-bottom-bar";
import type { CheckoutEvent, OrderBreakdown } from "../types/checkout";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import { toast } from "sonner";
import { config } from "@/shared/config";

interface CheckoutClientProps {
  event: CheckoutEvent;
  breakdown: OrderBreakdown;
  seats?: string;
  fail?: boolean;
  sessionId?: string;
  seatIdsList?: number[];
}

export function CheckoutClient({ event, breakdown, seats, fail, sessionId, seatIdsList = [] }: CheckoutClientProps) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const paymentStatusRef = useRef(paymentStatus);
  useEffect(() => {
    paymentStatusRef.current = paymentStatus;
  }, [paymentStatus]);

  // Cleanup: unlock seats when navigating away / component unmounts
  useEffect(() => {
    return () => {
      if (paymentStatusRef.current !== "success" && sessionId && seatIdsList.length > 0) {
        const unlockPayload = seatIdsList.map((id) => ({
          eventSessionId: Number(sessionId),
          seatId: id,
          status: "AVAILABLE" as const,
        }));
        VenueSeatMapService.unlockSeats(sessionId, unlockPayload)
          .catch((err) => console.error("Failed to unlock seats on unmount:", err));
      }
    };
  }, [sessionId, seatIdsList]);

  // Window unload: unlock seats when closing browser / reloading
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (paymentStatusRef.current !== "success" && sessionId && seatIdsList.length > 0) {
        const unlockPayload = seatIdsList.map((id) => ({
          eventSessionId: Number(sessionId),
          seatId: id,
          status: "AVAILABLE" as const,
        }));
        const baseUrl = config.api.baseUrl || "";
        const url = `${baseUrl}/event/api/event-sessions/${sessionId}/session-seats/batch/unlock`;
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(unlockPayload),
          keepalive: true,
        }).catch((err) => console.error("Failed to unlock seats via keepalive fetch:", err));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionId, seatIdsList]);

  const handlePay = () => {
    setPaymentStatus("processing");
    // Simulate network authorization latency (3.5 seconds)
    setTimeout(async () => {
      if (fail) {
        try {
          if (sessionId && seatIdsList.length > 0) {
            const unlockPayload = seatIdsList.map((id) => ({
              eventSessionId: Number(sessionId),
              seatId: id,
              status: "AVAILABLE" as const,
            }));
            await VenueSeatMapService.unlockSeats(sessionId, unlockPayload);
          }
        } catch (err) {
          console.error("Failed to unlock seats on payment failure:", err);
        }

        setPaymentStatus("error");
        // Redirect to failed page after 1.5 seconds so user sees the error state animation
        setTimeout(() => {
          router.push(`/checkout/failed?eventId=${event.id}&seats=${seats || ""}&total=${breakdown.totalAmount}&reason=declined`);
        }, 1500);
      } else {
        try {
          if (sessionId && seatIdsList.length > 0) {
            const bookPayload = seatIdsList.map((id) => ({
              eventSessionId: Number(sessionId),
              seatId: id,
              status: "SOLD" as const,
            }));
            await VenueSeatMapService.bookSeats(sessionId, bookPayload);
          }
        } catch (err) {
          console.error("Failed to book seats on payment success:", err);
          toast.error("Failed to confirm seat booking. They may have expired.");
          setPaymentStatus("error");
          return;
        }

        setPaymentStatus("success");
        // Redirect to confirmed page after 1.5 seconds so user sees the success state animation
        setTimeout(() => {
          router.push(`/checkout/confirmed?eventId=${event.id}&seats=${seats || ""}&total=${breakdown.totalAmount}`);
        }, 1500);
      }
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 w-full">
        <main 
          id="main-content"
          className="pt-24 pb-24 md:pb-12 px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Left Side: Payment details */}
          <div className="md:col-span-8">
            <PaymentSection 
              totalAmount={breakdown.totalAmount}
              paymentStatus={paymentStatus}
              onPay={handlePay}
              eventName={event.title}
            />
          </div>

          {/* Right Side: Sidebar Ticket breakdown */}
          <div className="md:col-span-4">
            <OrderSummary 
              event={event}
              breakdown={breakdown}
              paymentStatus={paymentStatus}
              onPay={handlePay}
            />
          </div>
        </main>
      </div>

      {/* Mobile Sticky Bar */}
      <MobileBottomBar 
        totalAmount={breakdown.totalAmount}
        paymentStatus={paymentStatus}
        onPay={handlePay}
      />
    </div>
  );
}
