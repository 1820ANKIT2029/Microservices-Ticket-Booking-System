"use client";

import * as React from "react";
import Link from "next/link";
import { AuthFooter } from "./auth-footer";

interface AuthLayoutProps {
  heroImage: string;
  heroTitle: string;
  heroDescription: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthLayout({
  heroImage,
  heroTitle,
  heroDescription,
  badgeText,
  badgeIcon,
  children,
}: AuthLayoutProps) {
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      if (window.innerWidth > 768) {
        const moveX = (e.clientX - window.innerWidth / 4) / 100;
        const moveY = (e.clientY - window.innerHeight / 2) / 100;
        imageRef.current.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Side: Atmospheric Hero (Visual Anchor) */}
        <section
          className="relative w-full md:w-1/2 min-h-[400px] md:min-h-screen overflow-hidden flex items-end md:items-center justify-center py-12 md:py-0"
          aria-label="Welcome banner"
        >
          {/* Background Image Wrapper */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              alt="Live entertainment"
              className="w-full h-full object-cover transition-transform duration-300 ease-out scale-110"
              src={heroImage}
            />
            {/* Purple Gradient & Tonal Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-inverse-surface/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 px-6 md:px-16 text-center md:text-left max-w-xl w-full">
            {badgeText && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                {badgeIcon && (
                  <span className="text-primary-fixed text-sm flex items-center" aria-hidden="true">
                    {badgeIcon}
                  </span>
                )}
                <span className="font-semibold text-xs tracking-wider uppercase text-on-primary-container">
                  {badgeText}
                </span>
              </div>
            )}
            <h1 className="text-display-lg-mobile md:text-display-lg text-white font-bold mb-6 leading-tight drop-shadow-[0_0_20px_rgba(112,0,255,0.4)]">
              {heroTitle}
            </h1>
            <p className="text-body-lg text-white/80 max-w-md hidden md:block leading-relaxed">
              {heroDescription}
            </p>
          </div>

          {/* Decorative Bottom Indicator */}
          <div className="absolute bottom-10 left-16 hidden md:block">
            <div className="flex gap-3">
              <div className="w-12 h-[2px] bg-primary-fixed/50" />
              <div className="w-12 h-[2px] bg-primary-fixed/20" />
              <div className="w-12 h-[2px] bg-primary-fixed/20" />
            </div>
          </div>
        </section>

        {/* Right Side: Interactive Form (Canvas) */}
        <section
          className="w-full md:w-1/2 bg-surface flex flex-col items-center justify-center py-16 px-6 md:px-16"
          aria-label="Auth forms"
        >
          <div className="w-full max-w-md my-auto">
            {/* Brand Anchor */}
            <div className="mb-10 flex flex-col items-center md:items-start">
              <Link
                href="/"
                className="text-display-lg-mobile text-primary tracking-tight font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              >
                EventPass
              </Link>
              <div className="h-1 w-12 bg-primary-container rounded-full mt-1.5" />
            </div>

            {/* Nested Form and Auth Fields */}
            {children}
          </div>
        </section>
      </main>

      {/* Shared Auth Footer */}
      <AuthFooter />
    </div>
  );
}
