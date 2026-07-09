"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${
        type === "success"
          ? "bg-green-500/15 border border-green-500/30 text-green-400"
          : "bg-red-500/15 border border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showSuccess = (message: string) => setToast({ message, type: "success" });
  const showError = (message: string) => setToast({ message, type: "error" });

  const ToastElement = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { showSuccess, showError, ToastElement };
}
