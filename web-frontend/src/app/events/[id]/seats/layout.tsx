import type { Metadata } from "next";
import { getCheckoutEventById } from "@/features/checkout/constants/checkout-data";

interface LayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = getCheckoutEventById(id);
  
  return {
    title: `Seat Selection - ${event.title} | EventPass`,
    description: `Interactive Wankhede seat selection layout for ${event.title}.`,
  };
}

export default function SeatsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
