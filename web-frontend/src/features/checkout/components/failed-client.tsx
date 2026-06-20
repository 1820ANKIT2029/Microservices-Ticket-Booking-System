"use client";

import { AlertOctagon, RefreshCw, Home, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { CheckoutEvent } from "@/features/checkout/types/checkout";

interface FailedClientProps {
  event: CheckoutEvent;
  seatsList: string[];
  totalAmount: number;
  reason?: string;
}

export function FailedClient({
  event,
  seatsList,
  totalAmount,
  reason,
}: FailedClientProps) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formattedSeats = seatsList.map((s) => {
    const parts = s.split("-");
    return parts[2] ? parts[0] + parts[2] : s;
  }).join(", ");

  const failureReasonText = reason === "timeout" 
    ? "Payment Authorization Timeout" 
    : "Transaction declined by the issuing bank";

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-grow pt-24 pb-20 px-4 md:px-16 flex flex-col items-center max-w-[800px] mx-auto w-full">
        
        {/* Error Banner */}
        <section className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-error-container/10 text-error rounded-full flex items-center justify-center mx-auto mb-4 border border-error/20">
            <AlertOctagon className="w-10 h-10 text-error" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-error font-sans mb-1.5">
            Booking Failed
          </h1>
          <p className="text-[10px] font-extrabold text-on-surface-variant tracking-widest uppercase">
            Attempt ID: EP-FAIL-8492067
          </p>
        </section>

        {/* Failed Details Card */}
        <section className="w-full relative mb-12">
          <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-md p-6 md:p-8 space-y-6">
            
            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/20">
              <span className="bg-error-container text-on-error-container text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-error/10">
                Payment Declined
              </span>
              <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                {event.title}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We were unable to process your payment for this order. **No funds have been debited from your account.** If your bank shows a temporary authorization or debit, it will be automatically reversed by your provider within 3-5 business days.
              </p>

              <div className="bg-surface-container rounded-xl p-4 space-y-3 border border-outline-variant/20 text-xs">
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="text-on-surface-variant font-medium">Declined Reason</span>
                  <span className="font-bold text-error">{failureReasonText}</span>
                </div>
                {seatsList.length > 0 && (
                  <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                    <span className="text-on-surface-variant font-medium">Selected Seats</span>
                    <span className="font-bold text-on-surface">{formattedSeats}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Amount Attempted</span>
                  <span className="font-bold text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mb-12">
          <Link 
            href={`/checkout?eventId=${event.id}&seats=${seatsList.join(",")}`}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Try Payment Again
          </Link>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-outline-variant/60 text-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </section>

        {/* Support & Alternate Billing advice */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-surface-container rounded-2xl p-5 flex items-start gap-4 border border-outline-variant/20 shadow-sm">
            <div className="w-10 h-10 bg-white border border-outline-variant/20 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">Contact Support</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                If money was deducted from your account, email support@eventpass.com with reference **EP-FAIL-8492067** for assistance.
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-5 flex items-start gap-4 border border-outline-variant/20 shadow-sm">
            <div className="w-10 h-10 bg-white border border-outline-variant/20 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">Try another method</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We recommend checking your card balance or using a different payment option, such as UPI, for a smoother checkout.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-outline-variant/40 bg-surface mt-auto">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          &copy; 2024 EventPass Ticketing Services. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
