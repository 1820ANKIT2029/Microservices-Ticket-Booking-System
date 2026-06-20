import type { Metadata } from "next";
import { DEFAULT_EVENT_DETAIL } from "@/features/events/constants/event-data";

interface LayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await params;
  const event = DEFAULT_EVENT_DETAIL;
  
  return {
    title: `${event.title} | EventPass`,
    description: event.descriptionParagraphs[0],
  };
}

export default function EventDetailLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
