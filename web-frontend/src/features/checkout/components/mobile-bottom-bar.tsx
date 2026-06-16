"use client";

import { Loader2 } from "lucide-react";

interface MobileBottomBarProps {
  totalAmount: number;
  paymentStatus: "idle" | "processing" | "success" | "error";
  onPay: () => void;
}

export function MobileBottomBar({
  totalAmount,
  paymentStatus,
  onPay,
}: MobileBottomBarProps) {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest p-4 border-t border-outline-variant/50 flex items-center justify-between z-50 shadow-lg"
      role="region"
      aria-label="Mobile payment action bar"
    >
      <div className="flex flex-col">
        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
          Total Amount
        </span>
        <span className="text-primary font-bold text-lg font-sans">
          {formattedAmount}
        </span>
      </div>

      <button 
        onClick={onPay}
        disabled={paymentStatus !== "idle"}
        className="bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary-container hover:text-on-primary-container disabled:bg-surface-container disabled:text-on-surface-variant transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {paymentStatus === "idle" && "Pay Now"}
        {paymentStatus === "processing" && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Paying...
          </>
        )}
        {paymentStatus === "success" && "Paid"}
        {paymentStatus === "error" && "Failed"}
      </button>
    </div>
  );
}
