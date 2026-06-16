"use client";

import type { CheckoutEvent, OrderBreakdown } from "../types/checkout";
import { ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderSummaryProps {
  event: CheckoutEvent;
  breakdown: OrderBreakdown;
  paymentStatus: "idle" | "processing" | "success" | "error";
  onPay: () => void;
}

export function OrderSummary({
  event,
  breakdown,
  paymentStatus,
  onPay,
}: OrderSummaryProps) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <aside className="md:col-span-4 flex flex-col gap-6" aria-labelledby="summary-title">
      <h2 id="summary-title" className="sr-only">Order Summary</h2>
      
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 border border-outline-variant/40 shadow-sm sticky top-24">
        
        {/* Ticket Header Details */}
        <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/30">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/20 relative">
            <Image 
              alt={event.imageAlt} 
              className="w-full h-full object-cover" 
              src={event.imageUrl} 
              unoptimized
              fill
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-on-surface truncate font-sans">
              {event.title}
            </h4>
            <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
              {event.dateText} &bull; {event.ticketType}
            </p>
          </div>
        </div>

        {/* Pricing Calculations */}
        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">
              Base Fare ({breakdown.qty}x)
            </span>
            <span className="text-on-surface font-semibold">
              {formatPrice(breakdown.baseFareTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">
              Booking Fee
            </span>
            <span className="text-on-surface font-semibold">
              {formatPrice(breakdown.bookingFee)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">
              Taxes (GST 18%)
            </span>
            <span className="text-on-surface font-semibold">
              {formatPrice(breakdown.taxesGst)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-dashed border-outline-variant/50 mt-1">
            <span className="text-on-surface font-bold text-base">
              Total Amount
            </span>
            <span className="text-primary font-bold text-lg font-sans">
              {formatPrice(breakdown.totalAmount)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onPay}
          disabled={paymentStatus !== "idle"}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base hover:bg-primary-container hover:text-on-primary-container disabled:bg-surface-container disabled:text-on-surface-variant active:scale-[0.98] transition-all shadow-md mt-2 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {paymentStatus === "idle" && `Pay ${formatPrice(breakdown.totalAmount)}`}
          {paymentStatus === "processing" && (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          )}
          {paymentStatus === "success" && "Booking Confirmed"}
          {paymentStatus === "error" && "Payment Failed"}
        </button>

        {/* Security Compliance Badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-[#15803d]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-600/10" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            PCI-DSS COMPLIANT
          </span>
        </div>
      </div>

      {/* Policies Disclaimer text */}
      <div className="px-6 text-center">
        <p className="text-[10px] text-on-surface-variant leading-relaxed">
          By clicking &apos;Pay&apos;, you agree to our{" "}
          <Link href="#" className="underline hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">
            Cancellation Policy
          </Link>
          . A booking confirmation will be sent to your registered email.
        </p>
      </div>
    </aside>
  );
}
