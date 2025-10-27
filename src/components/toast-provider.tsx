"use client";

import { clsx } from "clsx";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastKind = "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  kind?: ToastKind;
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: string;
  kind: ToastKind;
}

interface ToastContextValue {
  pushToast: (toast: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timersRef = useRef(new Map<string, number>());

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timeoutId = timersRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timersRef.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    ({ title, description, kind = "info", duration = 4000 }: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [
        ...current,
        { id, title, description, kind, duration },
      ]);

      const timeoutId = window.setTimeout(() => {
        dismissToast(id);
      }, duration);
      timersRef.current.set(id, timeoutId);
      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ pushToast, dismissToast }),
    [pushToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 pb-6">
        {toasts.map((toast) => (
          <output
            key={toast.id}
            aria-live="polite"
            className={clsx(
              "pointer-events-auto flex w-[min(420px,90vw)] items-start gap-3 rounded-2xl border px-5 py-4 shadow-lg",
              toast.kind === "success" &&
                "border-teal-400/40 bg-teal-500/10 text-teal-100",
              toast.kind === "error" &&
                "border-rose-500/40 bg-rose-500/10 text-rose-100",
              toast.kind === "info" &&
                "border-white/10 bg-slate-900/90 text-slate-100",
            )}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs text-slate-300">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Close
            </button>
          </output>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
