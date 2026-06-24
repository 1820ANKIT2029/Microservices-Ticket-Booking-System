"use client";

import { CreditCard, ShieldCheck, Lock, Loader2, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { FormatUtils } from "@/shared/utils";
import Image from "next/image";

interface PaymentSectionProps {
  totalAmount: number;
  paymentStatus: "idle" | "processing" | "success" | "error";
  onPay: () => void;
  eventName: string;
}

export function PaymentSection({
  totalAmount,
  paymentStatus,
  onPay,
  eventName,
}: PaymentSectionProps) {
  const formattedAmount = useMemo(() => {
    return FormatUtils.formatCurrency(totalAmount);
  }, [totalAmount]);

  return (
    <section className="md:col-span-8 flex flex-col gap-6" aria-labelledby="payment-section-title">
      <div className="flex flex-col gap-1 mb-2">
        <h1 
          id="payment-section-title"
          className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl font-sans"
        >
          Secure Checkout
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant font-medium">
          Choose your preferred payment method to complete the booking.
        </p>
      </div>

      {paymentStatus === "idle" && (
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-6 border border-outline-variant/40 shadow-sm">
          <div className="w-48 h-12 flex items-center justify-center mb-2 relative">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
              alt="Razorpay Secure Payment Gateway Logo" 
              className="w-full h-full object-contain"
              unoptimized
              fill
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-on-surface font-sans">
              Secure Payment Gateway
            </h3>
            <p className="text-sm text-on-surface-variant">
              All major debit/credit cards, UPI, Wallets, and Netbanking supported.
            </p>
          </div>

          <button 
            onClick={onPay}
            className="w-full max-w-md bg-primary text-on-primary py-4 rounded-xl font-bold text-lg hover:bg-primary-container hover:text-on-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <CreditCard className="w-5 h-5" />
            Pay with Razorpay
          </button>

          <div className="flex items-center gap-1.5 opacity-60 text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Secured by Razorpay
            </span>
          </div>
        </div>
      )}

      {paymentStatus === "processing" && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-6 border border-outline-variant/40 shadow-md">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-on-surface font-sans">
              Processing Payment...
            </h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              Please do not close this window or click back. We are securely connecting to Razorpay to authorize your payment of <span className="font-bold text-primary">{formattedAmount}</span>.
            </p>
          </div>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-6 border border-primary/20 bg-primary-fixed/10 shadow-lg animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 shadow-inner">
            <ShieldCheck className="w-10 h-10" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-on-surface font-sans">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Your ticket order for <span className="font-bold text-primary">{eventName}</span> has been confirmed. A receipt and digital ticket confirmation have been sent to your registered email.
            </p>
          </div>

          <div className="w-full max-w-md bg-white border border-outline-variant/40 rounded-xl p-6 text-left space-y-3 shadow-sm">
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-xs text-on-surface-variant font-medium">Transaction ID</span>
              <span className="text-xs font-mono font-bold text-on-surface">EP-TX-8492067</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-xs text-on-surface-variant font-medium">Booking Status</span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SUCCESSFUL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Amount Charged</span>
              <span className="text-xs font-bold text-primary">{formattedAmount}</span>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-6 border border-error/20 bg-error-container/10 shadow-lg animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-on-surface font-sans">
              Payment Failed!
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              We could not authorize your payment. You will be automatically redirected to retry with a different card or billing method in a moment.
            </p>
          </div>
        </div>
      )}

      {/* Secure Security Disclaimer Banner */}
      <div 
        className="flex items-start gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20"
        role="note"
      >
        <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-on-surface">
            Bank-grade Security
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your transaction is secured with 256-bit AES encryption and SSL/TLS. We do not store or transmit your sensitive card details.
          </p>
        </div>
      </div>
    </section>
  );
}
