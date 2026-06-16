"use client";

import * as React from "react";
import { CreditCard, Trash2, Plus, ArrowRight } from "lucide-react";
import { SavedCard } from "@/features/users/types/profile";
import { Button } from "@/shared/components/ui/button";

interface PaymentsTabProps {
  initialCards: SavedCard[];
}

export function PaymentsTab({ initialCards }: PaymentsTabProps) {
  const [cards, setCards] = React.useState<SavedCard[]>(initialCards);
  const [isAdding, setIsAdding] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState("");
  const [expDate, setExpDate] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [cardBrand, setCardBrand] = React.useState<"visa" | "mastercard" | "amex">("visa");

  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSetDefault = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    );
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    const cleanNumber = cardNumber.replace(/\s+/g, "");
    if (cleanNumber.length < 15 || cleanNumber.length > 16) {
      setError("Please enter a valid card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expDate)) {
      setError("Please enter expiration date in MM/YY format.");
      return;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setError("Please enter a valid CVV.");
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const last4 = cleanNumber.slice(-4);
      const newCard: SavedCard = {
        id: `card-${Date.now()}`,
        brand: cardBrand,
        last4,
        expDate,
        isDefault: cards.length === 0,
      };

      setCards((prev) => [...prev, newCard]);
      setCardNumber("");
      setExpDate("");
      setCvv("");
      setIsAdding(false);
    } catch {
      setError("Failed to add card. Please check your details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <header className="mb-6flex justify-between items-start gap-4">
        <div>
          <h1 className="text-headline-md font-bold text-on-background mb-1">
            Saved Payments
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Manage your saved credit cards for one-click express event checkouts.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-label-sm font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer border-none shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="size-4" />
            <span>Add Card</span>
          </button>
        )}
      </header>

      {error && (
        <div
          className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/15"
          role="alert"
        >
          {error}
        </div>
      )}

      {isAdding ? (
        <form
          onSubmit={handleAddCardSubmit}
          className="bg-surface border border-outline-variant/30 p-6 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-3 duration-250"
        >
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
            <h3 className="text-headline-sm font-bold text-on-surface">Add Payment Method</h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setError(null);
              }}
              type="button"
              className="text-on-surface-variant hover:text-primary font-bold text-label-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            {/* Card Brand Selector */}
            <div className="space-y-2">
              <span className="text-label-md font-bold text-on-surface block">Card Provider</span>
              <div className="flex gap-4">
                {(["visa", "mastercard", "amex"] as const).map((brand) => (
                  <label
                    key={brand}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-label-md font-semibold cursor-pointer transition-all select-none ${
                      cardBrand === brand
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant hover:border-primary/50 text-on-surface-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardBrand"
                      className="sr-only"
                      checked={cardBrand === brand}
                      onChange={() => setCardBrand(brand)}
                    />
                    <span className="capitalize">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card Details Form */}
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface block" htmlFor="cardNumber">
                Card Number
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center">
                  <CreditCard className="size-5" />
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/70"
                  id="cardNumber"
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-label-md font-bold text-on-surface block" htmlFor="expDate">
                  Expiration Date
                </label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/70"
                  id="expDate"
                  type="text"
                  placeholder="MM/YY"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-label-md font-bold text-on-surface block" htmlFor="cvv">
                  CVV / CVC
                </label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/70"
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/20">
            <button
              onClick={() => {
                setIsAdding(false);
                setError(null);
              }}
              type="button"
              className="px-6 py-3 font-semibold text-label-md text-on-surface-variant hover:bg-surface-container-highest/60 rounded-lg transition-colors cursor-pointer border-none"
              disabled={isSaving}
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="px-8 py-3 bg-primary text-on-primary text-label-md font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Card"}
              {!isSaving && <ArrowRight className="size-4" />}
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          {cards.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-outline-variant/40 rounded-2xl bg-surface-container-low/40">
              <CreditCard className="size-10 text-outline/50 mx-auto mb-3" />
              <h3 className="font-bold text-label-md text-on-surface">No Payment Methods</h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-4">
                You haven&apos;t saved any credit cards yet.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-2 bg-primary text-on-primary text-label-sm font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer border-none"
              >
                Add Your First Card
              </button>
            </div>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className={`p-6 rounded-2xl border bg-surface-container-lowest flex items-center justify-between transition-all hover:border-primary/40 ${
                  card.isDefault
                    ? "border-primary shadow-sm bg-primary/[0.01]"
                    : "border-outline-variant/30"
                }`}
              >
                <div className="flex gap-4 items-center min-w-0">
                  <div className="w-14 h-10 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container border border-outline-variant/30 shrink-0 font-bold text-xs uppercase select-none">
                    {card.brand}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-label-md text-on-surface capitalize">
                        {card.brand} ending in {card.last4}
                      </h3>
                      {card.isDefault && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant/80 mt-1">
                      Expires {card.expDate}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  {!card.isDefault && (
                    <button
                      onClick={() => handleSetDefault(card.id)}
                      className="text-label-sm font-semibold text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2.5 py-1.5"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="p-2 text-outline hover:text-error hover:bg-error/5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                    aria-label={`Remove ${card.brand} card ending in ${card.last4}`}
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
