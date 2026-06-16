import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="w-full py-6 px-4 md:px-16 bg-surface-container-low border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
        <span className="text-headline-sm font-bold text-on-surface">EventPass</span>
        <span className="text-on-surface-variant/80 text-label-md md:ml-4">
          © {new Date().getFullYear()} EventPass Technologies. All rights reserved.
        </span>
      </div>
      <nav className="flex gap-6">
        <Link
          href="#"
          className="text-on-surface-variant/80 text-label-md hover:text-primary transition-all duration-200 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="text-on-surface-variant/80 text-label-md hover:text-primary transition-all duration-200 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          className="text-on-surface-variant/80 text-label-md hover:text-primary transition-all duration-200 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Support
        </Link>
      </nav>
    </footer>
  );
}
