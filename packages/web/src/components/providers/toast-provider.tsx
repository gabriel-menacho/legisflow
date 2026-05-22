"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; message: string; type: "success" | "error" };

const ToastContext = createContext<{
  toast: (message: string, type?: "success" | "error") => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const hasError = toasts.some((t) => t.type === "error");

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div
          role="status"
          aria-live={hasError ? "assertive" : "polite"}
          aria-atomic="true"
          className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`glass-panel px-4 py-3 text-sm ${
                t.type === "error" ? "border-error text-error" : "text-primary-container"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast within ToastProvider");
  return ctx;
}
