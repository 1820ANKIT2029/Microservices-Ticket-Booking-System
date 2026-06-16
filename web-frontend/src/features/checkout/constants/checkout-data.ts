import type { CheckoutEvent, OrderBreakdown } from "../types/checkout";

export const DEFAULT_CHECKOUT_EVENT: CheckoutEvent = {
  id: "neon-horizon-fest",
  title: "Neon Horizon Fest",
  dateText: "Oct 24, 2024",
  ticketType: "VIP Access",
  basePrice: 2249.50, // 2249.5 * 2 = 4499
  imageUrl: "https://placehold.co/600x400/5400c3/ffffff/png?text=Neon+Horizon+Fest",
  imageAlt: "A vibrant concert stage with professional stage lighting casting purple and blue hues over a silhouetted crowd.",
};

export const MOCK_CHECKOUT_EVENTS: Record<string, CheckoutEvent> = {
  "neon-horizon-fest": DEFAULT_CHECKOUT_EVENT,
  "mumbai-city-fc-vs-mohun-bagan": {
    id: "mumbai-city-fc-vs-mohun-bagan",
    title: "IPL 2025: Mumbai City FC vs Mohun Bagan",
    dateText: "Sat, 24 May 2025",
    ticketType: "General Admission",
    basePrice: 1200,
    imageUrl: "https://placehold.co/600x400/0f172a/ffffff/png?text=Mumbai+City+FC+vs+Mohun+Bagan",
    imageAlt: "A wide-angle landscape shot of a massive, modern stadium packed with thousands of fans under bright evening floodlights.",
  },
  "mumbai-indians-vs-rcb": {
    id: "mumbai-indians-vs-rcb",
    title: "IPL 2025: Mumbai Indians vs RCB",
    dateText: "Sun, 14 Apr 2025",
    ticketType: "Platinum / Gold",
    basePrice: 2500,
    imageUrl: "https://placehold.co/600x400/0f172a/ffffff/png?text=MI+vs+RCB",
    imageAlt: "A cinematic, wide-angle interior photograph of a modern cricket stadium at sunset.",
  },
};

export function getCheckoutEventById(id?: string): CheckoutEvent {
  if (!id || !MOCK_CHECKOUT_EVENTS[id]) {
    // If not found in our specific checkout map, fallback to default or try loading matching ID from homepage
    return MOCK_CHECKOUT_EVENTS["mumbai-indians-vs-rcb"];
  }
  return MOCK_CHECKOUT_EVENTS[id];
}

export function calculateOrderBreakdown(
  event: CheckoutEvent, 
  qty: number, 
  seatsList?: string[]
): OrderBreakdown {
  let baseFareTotal = 0;

  if (seatsList && seatsList.length > 0) {
    seatsList.forEach((seat) => {
      const trimmed = seat.trim();
      if (trimmed.startsWith("P-")) {
        baseFareTotal += 4500;
      } else if (trimmed.startsWith("G-")) {
        baseFareTotal += 2500;
      } else {
        baseFareTotal += event.basePrice;
      }
    });
  } else {
    baseFareTotal = Math.round(event.basePrice * qty);
  }

  // Custom booking fee: ₹149 for Neon Horizon, ₹50 * quantity for sports events
  const bookingFee = event.id === "neon-horizon-fest" ? 149 : Math.round(50 * qty);
  // GST is 18% of the base fare
  const taxesGst = Math.round(baseFareTotal * 0.18);
  const totalAmount = baseFareTotal + bookingFee + taxesGst;

  return {
    basePrice: seatsList && seatsList.length > 0 ? Math.round(baseFareTotal / seatsList.length) : event.basePrice,
    qty,
    baseFareTotal,
    bookingFee,
    taxesGst,
    totalAmount,
  };
}
