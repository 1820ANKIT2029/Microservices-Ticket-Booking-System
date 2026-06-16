"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, HelpCircle, Bell } from "lucide-react";
import Image from "next/image";

export function CheckoutHeader() {
  const router = useRouter();

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-16 bg-surface border-b border-outline-variant/50"
      role="banner"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="md:hidden text-primary p-1 rounded-full hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-2xl font-bold tracking-tight text-primary font-sans select-none">
          EventPass
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="p-1 rounded-full text-primary hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Help and Support"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        <button 
          className="p-1 rounded-full text-primary hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6" />
        </button>
        <div 
          className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden ml-2 border border-outline-variant/30"
          role="img"
          aria-label="User profile photo"
        >
          <Image 
            alt="User profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb92o1ukNWULySVhkR0bd3L4J6g8HkdOa30q9HVNNZ_70qwbvqEazLkn52J9RG8RiCe4FOGd9HdtLSzY2sGXjhz2nmg_qC03OpgoYRrjycFOdLwztSDKNWabLZ5B1m38lbQK7_eN_gh6sAiaTP9mYeclqjoK8ScnQjpYZKS8cCGliUIHua95L1l6I7RW5uDhcJtgeHgvRfIqVkjuJW5Z88-lomXaSJXa5Z3QsZdzss-ZaaFS8xMEEiW9Iq1A2LAYwyPYKskrcKM85l"
            unoptimized
            width={32}
            height={32}
          />
        </div>
      </div>
    </header>
  );
}
