import React from "react";
import { Button } from "@/shared/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isProcessing?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  isProcessing = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const btnClass = variant === "danger" 
    ? "bg-error text-error-foreground hover:bg-error/90" 
    : variant === "warning"
    ? "bg-warning text-warning-foreground hover:bg-warning/90"
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-title-lg font-bold text-on-surface mb-2">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>
        <div className="bg-surface-container-low p-4 px-6 flex justify-end gap-3 border-t border-outline-variant/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            {cancelText}
          </Button>
          <Button
            className={btnClass}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
