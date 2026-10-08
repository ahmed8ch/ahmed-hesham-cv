"use client";

import { X, Zap } from "lucide-react";

type KobraToastProps = {
  open: boolean;
  onClose: () => void;
};

export function KobraToast({ open, onClose }: KobraToastProps) {
  if (!open) return null;
  return (
    <aside className="kobra-toast" role="status" aria-live="polite">
      <div className="toast-heading">
        <span><Zap size={13} aria-hidden="true" /> KOBRA / SYSTEM ALERT</span>
        <button type="button" onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button>
      </div>
      <p>Execution Halted: Exit Code 418 (I&apos;m a teapot). Rule #1: Never deploy to production on a Friday. Automatic rollback initiated.</p>
    </aside>
  );
}
