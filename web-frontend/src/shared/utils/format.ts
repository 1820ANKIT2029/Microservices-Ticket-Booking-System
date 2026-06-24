/**
 * Utility class for formatting common data types like Currency, Date, and Time.
 */
export class FormatUtils {
  private static currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  private static dateFormatter = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  private static timeFormatter = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  /**
   * Formats a number as a currency string (e.g., ₹1,000)
   */
  static formatCurrency(amount: number): string {
    return this.currencyFormatter.format(amount);
  }

  /**
   * Formats a Date or date string to a standard local date representation.
   */
  static formatDate(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return this.dateFormatter.format(d);
  }

  /**
   * Formats a Date or date string to a standard local time representation.
   */
  static formatTime(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return this.timeFormatter.format(d);
  }
}
