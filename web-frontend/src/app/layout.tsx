import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Navbar } from "@/shared/components";
import { AppProvider } from "@/shared/providers/app-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventPass",
  description:
    "Your gateway to live experiences — movies, sports, and concerts.",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
