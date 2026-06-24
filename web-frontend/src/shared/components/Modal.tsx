"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className={`bg-surface rounded-xl shadow-xl w-full ${maxWidth} flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <h2 className="text-title-lg font-bold text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
