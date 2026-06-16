"use client";

export function NewsletterSignup() {
  return (
    <section className="py-12 max-w-screen-2xl mx-auto px-6 md:px-16" aria-label="Newsletter Subscription">
      <div className="bg-primary p-10 md:p-16 rounded-[2.5rem] text-on-primary text-center">
        <h2 className="text-display-lg-mobile md:text-display-lg font-black mb-4 leading-tight">
          Never miss a beat.
        </h2>
        <p className="text-body-lg mb-8 opacity-85 max-w-2xl mx-auto font-medium">
          Get early access to tickets and exclusive lineup announcements delivered to your inbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto w-full"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            aria-label="Email address for newsletter"
            className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white focus:outline-none outline-none transition-all"
          />
          <button
            type="submit"
            className="bg-white text-primary font-bold px-8 py-3 rounded-full whitespace-nowrap hover:bg-white/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition-all cursor-pointer w-full sm:w-auto"
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
}
