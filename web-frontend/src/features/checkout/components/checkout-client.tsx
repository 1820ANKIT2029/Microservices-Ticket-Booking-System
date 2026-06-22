"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentSection } from "./payment-section";
import { OrderSummary } from "./order-summary";
import { MobileBottomBar } from "./mobile-bottom-bar";
import type { CheckoutEvent, OrderBreakdown } from "../types/checkout";

interface CheckoutClientProps {
  event: CheckoutEvent;
  breakdown: OrderBreakdown;
  seats?: string;
  fail?: boolean;
  bookingRef?: string;
  gatewayKey?: string;
  bookingId?: string;
}

export function CheckoutClient({ event, breakdown, seats, fail, bookingRef, gatewayKey, bookingId }: CheckoutClientProps) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const handlePay = () => {
    setPaymentStatus("processing");
    // Simulate network authorization latency (3.5 seconds)
    setTimeout(() => {
      if (fail) {
        setPaymentStatus("error");
        // Redirect to failed page after 1.5 seconds so user sees the error state animation
        setTimeout(() => {
          router.push(`/checkout/failed?eventId=${event.id}&seats=${seats || ""}&total=${breakdown.totalAmount}&reason=declined`);
        }, 1500);
      } else {
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
          <div className="md:col-span-8 flex flex-col gap-4">
            {bookingRef && (
              <div className="glass-card p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs text-on-surface">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-muted-foreground">Booking Session Active</span>
                  <span className="font-mono text-primary font-bold">{bookingRef}</span>
                </div>
                {gatewayKey && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold tracking-wider text-[10px] uppercase border border-emerald-500/20">
                    Secure Gateway Connected
                  </span>
                )}
              </div>
            )}
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
